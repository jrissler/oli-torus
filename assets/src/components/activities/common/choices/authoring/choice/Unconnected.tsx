import React from 'react';
import { ChoiceId, RichText } from 'components/activities/types';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RemoveButton } from 'components/misc/RemoveButton';
import { Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
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
  const getStyle = (style: DraggingStyle | NotDraggingStyle | undefined) => {
    if (style?.transform) {
      const axisLockY = `translate(0px, ${style.transform.split(',').pop()}`;
      return {
        ...style,
        minHeight: 41,
        transform: axisLockY,
      };
    }
    return {
      ...style,
      minHeight: 41,
    };
  };

  return (
    <Draggable draggableId={choice.id} key={choice.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="d-flex mb-3 align-items-center"
          style={getStyle(provided.draggableProps.style)}
        >
          <div {...provided.dragHandleProps} style={{ width: 24 }} className="material-icons">
            drag_indicator
          </div>
          {icon}
          <RichTextEditor
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
