import React from 'react';
import { Choice, HasChoices, RichText } from 'components/activities/types';
import { MoveButton } from 'components/activities/common/authoring/choices/MoveButton';
import { canMoveChoiceDown, canMoveChoiceUp } from 'components/activities/common/authoring/utils';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RemoveButton } from 'components/misc/RemoveButton';
import { moveChoice } from 'components/activities/common/authoring/immerActions';

interface Props {
  choice: Choice;
  model: HasChoices;
  onEditContent: (id: string, content: RichText) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  icon: JSX.Element;
  dispatch: (action: (model: HasChoices) => void) => void;
}
export const MovableChoice = ({
  model,
  choice,
  onEditContent,
  onRemove,
  canRemove,
  icon,
  dispatch,
}: Props) => {
  return (
    <div key={choice.id} className="mb-2">
      <div className="d-flex" style={{ flex: 1 }}>
        <div className="d-flex flex-column">{icon}</div>
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
              onClick={() => dispatch(moveChoice('up', choice.id))}
              icon="arrow_drop_up"
            />
            <MoveButton
              choiceId={choice.id}
              predicate={(id) => canMoveChoiceDown(model, id)}
              onClick={() => dispatch(moveChoice('down', choice.id))}
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
