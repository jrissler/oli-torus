import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RichText } from 'components/activities/types';
import { Card } from 'components/common/Card';
import { ID } from 'data/content/model';
import { IFeedback } from '../types';

const FeedbackCard: React.FC<{
  feedback: IFeedback;
  title: React.ReactNode;
  update: (id: ID, content: RichText) => void;
}> = ({ title, feedback, update }) => {
  return (
    <Card.Card>
      <Card.Title>{title}</Card.Title>
      <Card.Content>
        <RichTextEditor
          style={{ backgroundColor: 'white' }}
          placeholder="Enter feedback"
          text={feedback.content}
          onEdit={(content) => update(feedback.id, content)}
        />
      </Card.Content>
    </Card.Card>
  );
};

interface Props {
  correctFeedback: IFeedback;
  incorrectFeedback: IFeedback;
  update: (id: ID, content: RichText) => void;
}
export const Unconnected: React.FC<Props> = ({
  correctFeedback,
  incorrectFeedback,
  update,
  children,
}) => {
  return (
    <>
      <FeedbackCard
        title="Feedback for correct answer"
        feedback={correctFeedback}
        update={update}
      />
      <FeedbackCard
        title="Feedback for incorrect answers"
        feedback={incorrectFeedback}
        update={update}
      />
      {children}
    </>
  );
};
