import React, { PropsWithChildren } from 'react';
import { Heading } from 'components/misc/Heading';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { CheckAllThatApplyModelSchema, ModelEditorProps } from '../schema';
import { ResponseId, RichText } from '../../types';
import { Description } from 'components/misc/Description';
import { IconCorrect, IconIncorrect } from 'components/misc/Icons';
import { classNames } from 'utils/classNames';
import { getCorrectResponse, getIncorrectResponse } from '../utils';

interface FeedbackProps {
  onEditFeedback: (responseId: ResponseId, content: RichText) => void;
  model: CheckAllThatApplyModelSchema;
}
export const Feedback = (props: PropsWithChildren<FeedbackProps>) => {
  const { onEditFeedback, model } = props;

  return (
    <div className={'mt-5 ' + classNames(['feedback'])}>
      <div className="mb-3" key={'correct feedback'}>
        <Description>
          <IconCorrect /> Feedback for Correct Answer
        </Description>
        <RichTextEditor
          text={getCorrectResponse(model).feedback.content}
          onEdit={(content) => onEditFeedback(getCorrectResponse(model).id, content)}
        />
      </div>
      {props.children}
      <div className="mb-3" key={'incorrect feedback'}>
        <Description>
          <IconIncorrect />
          Feedback for Incorrect Answers
        </Description>
        <RichTextEditor
          text={getIncorrectResponse(model).feedback.content}
          onEdit={(content) => onEditFeedback(getIncorrectResponse(model).id, content)}
        />
      </div>
    </div>
  );
};
