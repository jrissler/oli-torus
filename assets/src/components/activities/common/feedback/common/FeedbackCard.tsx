import { RichText } from 'data/content/activities/activity';
import { Card } from 'components/common/Card';
import { ID } from 'data/content/model';
import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { IFeedback } from 'data/content/activities/feedback';

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
