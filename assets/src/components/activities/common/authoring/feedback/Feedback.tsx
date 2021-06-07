import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { Card } from 'components/activities/common/authoring/Card';
import { getResponse } from '../utils';
import { HasParts, Response, ResponseId, RichText } from 'components/activities/types';
import { connect } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// The default getCorrectResponse and getIncorrectResponse only work
// for models with one part and one correct response + one catch-all incorrect
// response. If an activity type has a different model, the response finding strategies
// should be passed.

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {} as HasParts,
  reducers: {
    setResponseFeedback(state, action: PayloadAction<{ id: ResponseId; content: RichText }>) {
      getResponse(state, action.payload.id).feedback.content = action.payload.content;
    },
  },
});

interface AuthoringProps {
  correctResponse: Response;
  incorrectResponse: Response;
  onSetResponseFeedback: (id: ResponseId, content: RichText) => void;
}
const Authoring: React.FC<AuthoringProps> = ({
  correctResponse,
  incorrectResponse,
  onSetResponseFeedback,
  children,
}) => {
  const FeedbackCard: React.FC<{
    response: Response;
    title: React.ReactNode;
  }> = ({ title, response }) => {
    return (
      <Card.Card>
        <Card.Title>{title}</Card.Title>
        <Card.Content>
          <RichTextEditor
            style={{ backgroundColor: 'white' }}
            placeholder="Enter feedback"
            text={response.feedback.content}
            onEdit={(content) => onSetResponseFeedback(response.id, content)}
          />
        </Card.Content>
      </Card.Card>
    );
  };

  return (
    <>
      <FeedbackCard title="Feedback for correct answer" response={correctResponse} />
      <FeedbackCard title="Feedback for incorrect answers" response={incorrectResponse} />
      {children}
    </>
  );
};

export const Feedback = {
  Authoring: {
    Unconnected: Authoring,
    Connected: connect(
      (state: HasParts) => {
        const getCorrectResponse = (model: HasParts) =>
          model.authoring.parts[0].responses.find((r) => r.score === 1);
        const getIncorrectResponse = (model: HasParts) =>
          model.authoring.parts[0].responses.find((r) => r.score === 0);

        return {
          correctResponse: getCorrectResponse(state),
          incorrectResponse: getIncorrectResponse(state),
        };
      },
      (dispatch) => ({
        onSetResponseFeedback: (id: ResponseId, content: RichText) =>
          dispatch(feedbackSlice.actions.setResponseFeedback({ id, content })),
      }),
    )(Authoring),
  },
};
