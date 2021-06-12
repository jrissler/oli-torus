import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { Response, ResponseId, RichText } from 'components/activities/types';
import { Card } from 'components/common/Card';

const FeedbackCard: React.FC<{
  response: Response;
  title: React.ReactNode;
  update: (id: ResponseId, content: RichText) => void;
}> = ({ title, response, update }) => {
  return (
    <Card.Card>
      <Card.Title>{title}</Card.Title>
      <Card.Content>
        <RichTextEditor
          style={{ backgroundColor: 'white' }}
          placeholder="Enter feedback"
          text={response.feedback.content}
          onEdit={(content) => update(response.id, content)}
        />
      </Card.Content>
    </Card.Card>
  );
};

interface AuthoringProps {
  correctResponse: Response;
  incorrectResponse: Response;
  update: (id: ResponseId, content: RichText) => void;
}
export const Unconnected: React.FC<AuthoringProps> = ({
  correctResponse,
  incorrectResponse,
  update,
  children,
}) => {
  return (
    <>
      <FeedbackCard
        title="Feedback for correct answer"
        response={correctResponse}
        update={update}
      />
      <FeedbackCard
        title="Feedback for incorrect answers"
        response={incorrectResponse}
        update={update}
      />
      {children}
    </>
  );
};
