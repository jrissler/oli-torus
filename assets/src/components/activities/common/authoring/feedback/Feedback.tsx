import React, { PropsWithChildren } from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { Card } from 'components/activities/common/authoring/Card';
import {
  getCorrectResponse,
  getIncorrectResponse,
} from 'components/activities/check_all_that_apply/utils';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import produce, { Draft } from 'immer';
import { getResponse } from '../utils';
import { CheckAllThatApplyModelSchemaV2 } from 'components/activities/check_all_that_apply/schema';
import { ResponseId, RichText } from 'components/activities/types';

export function useFeedback() {
  const { model, dispatch } = useAuthoringElementContext<CheckAllThatApplyModelSchemaV2>();

  const setResponseFeedback = (id: ResponseId, content: RichText) =>
    produce(
      (draft: Draft<CheckAllThatApplyModelSchemaV2>) =>
        void (getResponse(draft, id).feedback.content = content),
    );

  const correctResponse = getCorrectResponse(model);
  const incorrectResponse = getIncorrectResponse(model);

  return { setResponseFeedback, correctResponse, incorrectResponse, dispatch };
}

interface AuthoringProps {
  onSetResponseFeedback?: (id: ResponseId, content: RichText) => void;
}
const Authoring: React.FC<AuthoringProps> = (props) => {
  const { setResponseFeedback, correctResponse, incorrectResponse, dispatch } = useFeedback();

  return (
    <>
      <Card
        title="Feedback for correct answer"
        content={
          <RichTextEditor
            style={{ backgroundColor: 'white' }}
            placeholder="Enter feedback"
            text={correctResponse.feedback.content}
            onEdit={(content) => dispatch(setResponseFeedback(correctResponse.id, content))}
          />
        }
      />

      <Card
        title="Feedback for incorrect answers"
        content={
          <RichTextEditor
            style={{ backgroundColor: 'white' }}
            placeholder="Enter feedback"
            text={incorrectResponse.feedback.content}
            onEdit={(content) => dispatch(setResponseFeedback(incorrectResponse.id, content))}
          />
        }
      />
    </>
  );
};

export const Feedback = {
  Authoring,
};
