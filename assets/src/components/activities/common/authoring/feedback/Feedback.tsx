import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { Card } from 'components/activities/common/authoring/Card';
import { getResponse } from '../utils';
import { HasParts, Response, ResponseId, RichText } from 'components/activities/types';
import { connect } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthoringProps {
  correctResponse: Response;
  incorrectResponse: Response;
  onSetResponseFeedback: (id: ResponseId, content: RichText) => void;
}
export const AuthoringFeedback: React.FC<AuthoringProps> = ({
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
