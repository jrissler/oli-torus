import React, { useState } from 'react';
import { ChoiceId, RichText } from 'components/activities/types';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RemoveButton } from 'components/misc/RemoveButton';
import {
  Draggable,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { IChoice } from '../../types';

interface Props {
  canRemove: boolean;
  icon: JSX.Element;
  index: number;

  choice: IChoice;
  onEdit: (id: ChoiceId, content: RichText) => void;
  onRemove: (id: ChoiceId) => void;
}
export const Unconnected: React.FC<Props> = ({
  canRemove,
  icon,
  index,
  choice,
  onEdit,
  onRemove,
}) => {
  const getStyle = (
    style: DraggingStyle | NotDraggingStyle | undefined,
    snapshot: DraggableStateSnapshot,
  ) => {
    const snapshotStyle = snapshot.draggingOver ? { 'pointer-events': 'none' } : {};
    if (style?.transform) {
      const axisLockY = `translate(0px, ${style.transform.split(',').pop()}`;
      return {
        ...style,
        ...snapshotStyle,
        minHeight: 41,
        transform: axisLockY,
      };
    }
    return {
      ...style,
      ...snapshotStyle,
      minHeight: 41,
    };
  };

  const [showDragIndicator, setShowDragIndicator] = useState(false);

  return (
    <Draggable draggableId={choice.id} key={choice.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onMouseOver={() => {
            !snapshot.isDragging && setShowDragIndicator(true);
          }}
          onMouseOut={() => {
            setShowDragIndicator(false);
          }}
          onDragEnd={() => setShowDragIndicator(false)}
          className="d-flex mb-3 align-items-center"
          style={getStyle(provided.draggableProps.style, snapshot)}
        >
          <div
            {...provided.dragHandleProps}
            style={{
              cursor: 'move',
              width: 24,
              opacity: showDragIndicator || snapshot.isDragging ? 1 : 0,
              color: 'rgba(0,0,0,0.26)',
            }}
            className="material-icons"
          >
            drag_indicator
          </div>
          <div style={{ width: 30, lineHeight: 1, pointerEvents: 'none', cursor: 'default' }}>
            {icon}
          </div>
          <RichTextEditor
            style={{ flexGrow: 1 }}
            placeholder="Answer choice"
            text={choice.content}
            onEdit={(content) => onEdit(choice.id, content)}
          />
          {canRemove && (
            <div className="d-flex justify-content-center" style={{ width: 48 }}>
              <RemoveButton onClick={() => onRemove(choice.id)} />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
Unconnected.displayName = 'ChoiceAuthoringEditor';
