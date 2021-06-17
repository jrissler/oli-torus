import { RichText } from 'components/activities/types';
import { Card } from 'components/common/Card';
import { ID } from 'data/content/model';
import { IFeedback } from '../types';
import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';

export const FeedbackCard: React.FC<{
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
