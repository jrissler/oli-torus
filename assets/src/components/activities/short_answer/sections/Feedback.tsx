import React, { useState } from 'react';
import { Heading } from 'components/misc/Heading';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { ModelEditorProps } from '../schema';
import { RichText } from '../../types';
import { Description } from 'components/misc/Description';
import { IconCorrect, IconIncorrect } from 'components/misc/Icons';
import { parseInputFromRule } from '../utils';
import { ProjectSlug } from 'data/types';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { IResponse } from 'components/activities/common/authoring/responses/types';

interface FeedbackProps {
  onEditResponse: (id: string, content: RichText) => void;
  onRemoveResponse: (id: string) => void;
  onAddResponse: () => void;
  onEditResponseRule: (id: string, rule: string) => void;
  model: any;
}

interface ItemProps extends FeedbackProps {
  response: IResponse;
}

export const Item = (props: ItemProps) => {
  const { response, onEditResponse } = props;
  const [value, setValue] = useState(parseInputFromRule(response.rule));

  const onEditRule = (input: string) => {
    if (input !== '.*') {
      setValue(input);

      const rule =
        props.model.inputType === 'numeric' ? `input = {${input}}` : `input like {${input}}`;

      props.onEditResponseRule(response.id, rule);
    }
  };

  if (response.score === 1) {
    return (
      <div className="my-3" key={response.id}>
        <Description>
          <IconCorrect /> Feedback for Correct Answer:
          <input
            type={props.model.inputType === 'numeric' ? 'number' : 'text'}
            className="form-control my-2"
            placeholder="Enter correct answer..."
            onChange={(e) => onEditRule(e.target.value)}
            value={value}
          />
        </Description>
        <RichTextEditor
          text={response.feedback.content}
          onEdit={(content) => onEditResponse(response.id, content)}
        />
      </div>
    );
  }
  if (value === '.*') {
    return (
      <div className="my-3" key={response.id}>
        <Description>
          <IconIncorrect /> Feedback for any other Incorrect Answer
        </Description>
        <RichTextEditor
          text={response.feedback.content}
          onEdit={(content) => onEditResponse(response.id, content)}
        />
      </div>
    );
  }

  return (
    <div className="my-3 d-flex mb-3" key={response.id}>
      <div className="d-flex flex-column flex-grow-1">
        <Description>
          <IconIncorrect /> Feedback for Incorrect Answer:
          <input
            type={props.model.inputType === 'numeric' ? 'number' : 'text'}
            className="form-control"
            onChange={(e) => onEditRule(e.target.value)}
            value={value}
          />
        </Description>
        <RichTextEditor
          text={response.feedback.content}
          onEdit={(content) => onEditResponse(response.id, content)}
        />
      </div>
      <RemoveButton onClick={() => props.onRemoveResponse(response.id)} />
    </div>
  );
};

export const Feedback = (props: FeedbackProps) => {
  const { model, onAddResponse } = props;
  const {
    authoring: { parts },
  } = model;

  return (
    <div className="my-5">
      <Heading
        title="Feedback"
        subtitle="Providing feedback when a student answers a
        question is one of the best ways to reinforce their understanding."
        id="feedback"
      />

      {parts[0].responses.map((response: IResponse) => (
        <Item key={response.id} {...props} response={response} />
      ))}

      <AuthoringButton className="btn btn-sm btn-primary my-2" onClick={onAddResponse}>
        Add Feedback
      </AuthoringButton>
    </div>
  );
};
