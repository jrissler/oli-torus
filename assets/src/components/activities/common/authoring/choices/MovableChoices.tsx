import React from 'react';
import { Choice, ChoiceId, HasChoices, RichText } from '../../../types';
import { MovableChoice } from 'components/activities/common/authoring/choices/MoveableChoice';
import { AuthoringButton } from 'components/misc/AuthoringButton';

interface Props {
  onAdd: () => void;
  onEditContent: (id: ChoiceId, content: RichText) => void;
  onRemove: (id: ChoiceId) => void;
  dispatch: (action: (model: HasChoices) => void) => void;
  choices: Choice[];
  model: HasChoices;
  icon: JSX.Element;
}
export const MovableChoices = (props: Props) => {
  const { onAdd, onEditContent, onRemove, choices, icon, dispatch } = props;

  return (
    <div className="answer-choices">
      {choices.map((choice, index) => (
        <MovableChoice
          dispatch={dispatch}
          icon={icon}
          key={index + 'choice'}
          model={props.model}
          choice={choice}
          onEditContent={onEditContent}
          onRemove={onRemove}
          canRemove={choices.length > 1}
        />
      ))}
      <div className="d-flex align-items-center" style={{ marginLeft: '32px' }}>
        <AuthoringButton className="btn btn-link pl-2" onClick={onAdd}>
          Add choice
        </AuthoringButton>
      </div>
    </div>
  );
};
