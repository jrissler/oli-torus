import React, { useState } from 'react';
import { Heading } from 'components/misc/Heading';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { ModelEditorProps } from '../schema';
import { RichText } from '../../types';
import { Description } from 'components/misc/Description';
import { IconCorrect, IconIncorrect } from 'components/misc/Icons';
import { ProjectSlug } from 'data/types';
import { IFeedback } from 'components/activities/common/feedback/types';

interface FeedbackProps extends ModelEditorProps {
  onEditResponse: (score: number, content: RichText) => void;
  projectSlug: ProjectSlug;
}

interface ItemProps extends FeedbackProps {
  feedback: IFeedback;
  score: number;
}

export const Item = (props: ItemProps) => {
  const { feedback, score, editMode, onEditResponse } = props;

  return (
    <div className="my-3" key={feedback.id}>
      <Description>
        {score === 1 ? <IconCorrect /> : <IconIncorrect />}
        Feedback for {score === 1 ? 'Correct' : 'Incorrect'} Answer:
      </Description>
      <RichTextEditor
        text={feedback.content}
        onEdit={(content) => onEditResponse(score, content)}
      />
    </div>
  );
};

export const Feedback = (props: FeedbackProps) => {
  const { model } = props;

  return (
    <div className="my-5">
      <Heading
        title="Feedback"
        subtitle="Providing feedback when a student answers a
        question is one of the best ways to reinforce their understanding."
        id="feedback"
      />

      {model.feedback.map((f: IFeedback, index) => (
        <Item key={index} {...props} feedback={f} score={index} />
      ))}
    </div>
  );
};
