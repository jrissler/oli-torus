import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { ChoiceIdsToResponseId, ModelEditorProps, TargetedCATA } from '../schema';
import { Description } from 'components/misc/Description';
import { IconIncorrect } from 'components/misc/Icons';
import { getChoiceIds, getResponseId } from '../utils';
import { Typeahead } from 'react-bootstrap-typeahead';
import { ChoiceId, ResponseId, RichText } from 'components/activities/types';
import { getResponse } from 'components/activities/common/authoring/utils';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';

interface Props {
  onEditFeedback: (id: string, content: RichText) => void;
  onAddTargetedFeedback: () => void;
  onRemoveTargetedFeedback: (responseId: ResponseId) => void;
  onEditTargetedFeedbackChoices: (responseId: ResponseId, choiceIds: ChoiceId[]) => void;
  model: TargetedCATA;
}

interface Option {
  id: string;
  label: string;
}
type OptionMap = { [id: string]: Option[] };

export const TargetedFeedback = (props: Props) => {
  const { editMode } = useAuthoringElementContext();

  const {
    model,
    onEditFeedback,
    onAddTargetedFeedback,
    onRemoveTargetedFeedback,
    onEditTargetedFeedbackChoices,
  } = props;

  const createSelection = (assocs: ChoiceIdsToResponseId[]) =>
    assocs.reduce((acc, assoc) => {
      acc[getResponseId(assoc)] = toOptions(getChoiceIds(assoc));
      return acc;
    }, {} as OptionMap);

  const toOptions = (choiceIds: ChoiceId[]) =>
    choiceIds.map((id) => ({
      id,
      label: (model.choices.findIndex((choice) => choice.id === id) + 1).toString(),
    }));

  const allChoiceOptions = toOptions(model.choices.map((choice) => choice.id));
  const selected = createSelection(model.authoring.targeted);

  return (
    <>
      {model.authoring.targeted.map((assoc) => {
        const response = getResponse(model, getResponseId(assoc));
        return (
          <div className="mb-3" key={response.id}>
            <Description>
              <IconIncorrect /> Feedback for Incorrect Combination
              <Typeahead
                id={response.id}
                disabled={!editMode}
                placeholder="Select choices..."
                options={allChoiceOptions}
                selected={selected[response.id]}
                selectHintOnEnter
                multiple
                onChange={(selection) =>
                  onEditTargetedFeedbackChoices(
                    response.id,
                    selection.map((s) => s.id),
                  )
                }
              />
            </Description>
            <div className="d-flex align-items-center" style={{ flex: 1 }}>
              <RichTextEditor
                className="flex-fill"
                text={response.feedback.content}
                onEdit={(content) => onEditFeedback(response.id, content)}
              />
              <RemoveButton onClick={() => onRemoveTargetedFeedback(response.id)} />
            </div>
          </div>
        );
      })}
      <AuthoringButton className="btn btn-sm btn-primary my-2" onClick={onAddTargetedFeedback}>
        Add targeted feedback
      </AuthoringButton>
    </>
  );
};
