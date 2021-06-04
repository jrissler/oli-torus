import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { Card } from 'components/activities/common/authoring/Card';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import produce, { Draft } from 'immer';
import { getResponse } from '../utils';
import { HasParts, Response, ResponseId, RichText } from 'components/activities/types';

interface FeedbackCardProps {
  onEdit: (text: RichText) => void;
  response: Response;
  title: string;
}
const FeedbackCard: React.FC<FeedbackCardProps> = ({ title, onEdit, response }) => {
  return (
    <Card
      title={title}
      content={
        <RichTextEditor
          style={{ backgroundColor: 'white' }}
          placeholder="Enter feedback"
          text={response.feedback.content}
          onEdit={onEdit}
        />
      }
    />
  );
};

// The default getCorrectResponse and getIncorrectResponse only work
// for models with one part and one correct response + one catch-all incorrect
// response. If an activity type has a different model, the response finding strategies
// should be passed.
export function useFeedback(
  getCorrectResponse = (model: HasParts) =>
    model.authoring.parts[0].responses.find((r) => r.score === 1),
  getIncorrectResponse = (model: HasParts) =>
    model.authoring.parts[0].responses.find((r) => r.score === 0),
) {
  const { model, dispatch } = useAuthoringElementContext<HasParts>();

  const setResponseFeedback = (id: ResponseId, content: RichText) =>
    produce((draft: Draft<HasParts>) => void (getResponse(draft, id).feedback.content = content));

  const correctResponse = getCorrectResponse(model);
  const incorrectResponse = getIncorrectResponse(model);
  if (!correctResponse || !incorrectResponse) {
    throw new Error('Feedback.tsx could not find the correct and incorrect responses.');
  }

  return { setResponseFeedback, correctResponse, incorrectResponse, dispatch };
}

interface AuthoringProps {
  onSetResponseFeedback?: (id: ResponseId, content: RichText) => void;
  getCorrectResponse?: (m: HasParts) => Response;
  getIncorrectResponse?: (m: HasParts) => Response;
}
const Authoring: React.FC<AuthoringProps> = ({
  onSetResponseFeedback,
  children,
  getCorrectResponse,
  getIncorrectResponse,
}) => {
  const { setResponseFeedback, correctResponse, incorrectResponse, dispatch } = useFeedback(
    getCorrectResponse,
    getIncorrectResponse,
  );

  return (
    <>
      <FeedbackCard
        title="Feedback for correct answer"
        response={correctResponse}
        onEdit={(content) =>
          onSetResponseFeedback
            ? onSetResponseFeedback(correctResponse.id, content)
            : dispatch(setResponseFeedback(correctResponse.id, content))
        }
      />

      <FeedbackCard
        title="Feedback for incorrect answers"
        response={incorrectResponse}
        onEdit={(content) =>
          onSetResponseFeedback
            ? onSetResponseFeedback(incorrectResponse.id, content)
            : dispatch(setResponseFeedback(incorrectResponse.id, content))
        }
      />

      {children}
    </>
  );
};

export const Feedback = {
  Authoring,
};
