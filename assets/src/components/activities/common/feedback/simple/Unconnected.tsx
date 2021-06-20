import React from 'react';
import { RichText } from 'data/content/activities/activity';
import { ID } from 'data/content/model';
import { FeedbackCard } from '../common/FeedbackCard';
import { Tooltip } from '../../authoring/Tooltip';
import { IFeedback } from 'data/content/activities/feedback';

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
        title={
          <>
            Feedback for incorrect answers{' '}
            <Tooltip
              title={
                'Shown for all student responses that do not match the correct answer or targeted feedback combinations'
              }
            />
          </>
        }
        feedback={incorrectFeedback}
        update={update}
      />
      {children}
    </>
  );
};
Unconnected.displayName = 'SimpleFeedbackAuthoringEditor';
