import React, { PropsWithChildren } from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { CheckAllThatApplyModelSchema } from '../../../check_all_that_apply/schema';
import { ResponseId, RichText } from '../../../types';
import { defaultWriterContext } from 'data/content/writers/context';
import { DisplayedChoices } from 'components/activities/common/delivery/choices/DisplayedChoices';
import { Card } from 'components/activities/common/authoring/Card';
import {
  getCorrectChoiceIds,
  getCorrectResponse,
  getIncorrectResponse,
} from 'components/activities/check_all_that_apply/utils';

interface FeedbackProps {
  onEditFeedback: (responseId: ResponseId, content: RichText) => void;
  model: CheckAllThatApplyModelSchema;
  toggleCorrect: any;
  isCorrect: any;
}
export const Feedback = (props: PropsWithChildren<FeedbackProps>) => {
  const { onEditFeedback, model } = props;
  const writerContext = defaultWriterContext();

  return (
    <>
      <DisplayedChoices
        unselectedIcon={<i className="material-icons-outlined">check_box_outline_blank</i>}
        selectedIcon={<i className="material-icons-outlined">check_box</i>}
        choices={model.choices}
        selected={getCorrectChoiceIds(model)}
        onSelect={(id) => props.toggleCorrect(id)}
        isEvaluated={false}
        context={writerContext}
      />

      <Card
        title="Feedback for correct answer"
        content={
          <RichTextEditor
            style={{ backgroundColor: 'white' }}
            placeholder="Enter feedback"
            text={getCorrectResponse(model).feedback.content}
            onEdit={(content) => onEditFeedback(getCorrectResponse(model).id, content)}
          />
        }
      />

      <Card
        title="Feedback for incorrect answers"
        content={
          <RichTextEditor
            style={{ backgroundColor: 'white' }}
            placeholder="Enter feedback"
            text={getIncorrectResponse(model).feedback.content}
            onEdit={(content) => onEditFeedback(getIncorrectResponse(model).id, content)}
          />
        }
      />
    </>
  );
};
