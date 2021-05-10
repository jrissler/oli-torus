import React from 'react';
import { Choice, ChoiceId, HasChoices, RichText } from '../../../types';
import { MovableChoice } from 'components/activities/common/authoring/choices/MoveableChoice';
import { AuthoringButton } from 'components/misc/AuthoringButton';

interface Props {
  onAdd: () => void;
  onEditContent: (id: ChoiceId, content: RichText) => void;
  onMoveUp: (id: ChoiceId) => void;
  onMoveDown: (id: ChoiceId) => void;
  onRemove: (id: ChoiceId) => void;
  choices: Choice[];
  model: HasChoices;
  correctIcon: JSX.Element;
  incorrectIcon: JSX.Element;
  isCorrect: (model: HasChoices, choiceId: ChoiceId) => boolean;
  toggleCorrect: (id: string) => void;
}
export const MovableChoices = (props: Props) => {
  const {
    onAdd,
    onEditContent,
    onRemove,
    onMoveUp,
    onMoveDown,
    choices,
    correctIcon,
    incorrectIcon,
    isCorrect,
    toggleCorrect,
  } = props;

  return (
    <div className="answer-choices">
      {choices.map((choice, index) => (
        <MovableChoice
          toggleCorrect={toggleCorrect}
          isCorrect={isCorrect}
          correctIcon={correctIcon}
          incorrectIcon={incorrectIcon}
          key={index + 'choice'}
          model={props.model}
          choice={choice}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onEditContent={onEditContent}
          onRemove={onRemove}
          canRemove={choices.length > 1}
        />
      ))}
      <div className="d-flex align-items-center" style={{ marginLeft: '32px' }}>
        {/* {icon} */}
        <AuthoringButton className="btn btn-link pl-2" onClick={onAdd}>
          Add choice
        </AuthoringButton>
      </div>
    </div>
  );
};
