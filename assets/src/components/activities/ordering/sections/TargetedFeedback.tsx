import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { ChoiceIdsToResponseId, ModelEditorProps, TargetedOrdering } from '../schema';
import { Description } from 'components/misc/Description';
import { IconIncorrect } from 'components/misc/Icons';
import { ProjectSlug } from 'data/types';
import { getChoiceIds, getResponseId } from '../utils';
import { Typeahead } from 'react-bootstrap-typeahead';
import { ChoiceId, ResponseId, RichText } from 'components/activities/types';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { getResponse } from 'components/activities/common/authoring/utils';

interface Props extends ModelEditorProps {
  onEditFeedback: (id: string, content: RichText) => void;
  onAddTargetedFeedback: () => void;
  onRemoveTargetedFeedback: (responseId: ResponseId) => void;
  onEditTargetedFeedbackChoices: (responseId: ResponseId, choiceIds: ChoiceId[]) => void;
  model: TargetedOrdering;
  projectSlug: ProjectSlug;
}

interface Option {
  id: string;
  label: string;
}
type OptionMap = { [id: string]: Option[] };

export const TargetedFeedback = (props: Props) => {
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
              <IconIncorrect /> Feedback for Incorrect Answer
              <Typeahead
                isInvalid={selected[response.id].length < allChoiceOptions.length}
                id={response.id}
                disabled={!props.editMode}
                placeholder="Order the choices to set the trigger for this feedback"
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
