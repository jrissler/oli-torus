import React from 'react';
import { Choice, ChoiceId, HasChoices, RichText } from 'components/activities/types';
import { MoveButton } from 'components/activities/common/authoring/choices/MoveButton';
import { canMoveChoiceDown, canMoveChoiceUp } from 'components/activities/common/authoring/utils';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';

interface Props {
  choice: Choice;
  model: HasChoices;
  onMoveUp: (id: ChoiceId) => void;
  onMoveDown: (id: ChoiceId) => void;
  onEditContent: (id: string, content: RichText) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  correctIcon: JSX.Element;
  incorrectIcon: JSX.Element;
  isCorrect: (model: HasChoices, choiceId: ChoiceId) => boolean;
  toggleCorrect: (choiceId: string) => void;
}
export const MovableChoice = ({
  model,
  choice,
  onMoveUp,
  onMoveDown,
  onEditContent,
  onRemove,
  canRemove,
  correctIcon,
  incorrectIcon,
  isCorrect,
  toggleCorrect,
}: Props) => {
  return (
    <div key={choice.id} className="mb-2">
      <div className="d-flex" style={{ flex: 1 }}>
        <div className="d-flex flex-column">
          <AuthoringButton
            className="btn mt-1 mr-2 p-0"
            style={{ boxShadow: 'none' }}
            onClick={() => toggleCorrect(choice.id)}
          >
            {isCorrect(model, choice.id) ? correctIcon : incorrectIcon}
          </AuthoringButton>
        </div>
        <RichTextEditor
          placeholder="Answer choice"
          style={{ backgroundColor: 'white ' }}
          className="flex-fill"
          text={choice.content}
          onEdit={(content) => onEditContent(choice.id, content)}
        />
        <div className="d-flex mt-1">
          <div className="d-flex flex-column">
            <MoveButton
              choiceId={choice.id}
              predicate={(id) => canMoveChoiceUp(model, id)}
              onClick={onMoveUp}
              icon="arrow_drop_up"
            />
            <MoveButton
              choiceId={choice.id}
              predicate={(id) => canMoveChoiceDown(model, id)}
              onClick={onMoveDown}
              icon="arrow_drop_down"
            />
          </div>
          <div className="d-flex align-items-start">
            {canRemove && <RemoveButton onClick={() => onRemove(choice.id)} />}
          </div>
        </div>
      </div>
    </div>
  );
};
