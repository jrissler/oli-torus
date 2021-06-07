import React from 'react';
import { Choice as ChoiceType, ChoiceId, RichText } from 'components/activities/types';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RemoveButton } from 'components/misc/RemoveButton';
import { Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
import { connect } from 'react-redux';

interface Props {
  canRemove: boolean;
  icon: JSX.Element;
  index: number;

  choice: ChoiceType;
  onEditChoiceContent: (id: ChoiceId, content: RichText) => void;
  onRemoveChoice: (id: ChoiceId) => void;
}
export const Component = ({
  canRemove,
  icon,
  index,
  choice,
  onEditChoiceContent,
  onRemoveChoice,
}: Props) => {
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
            onEdit={(content) => onEditChoiceContent(choice.id, content)}
          />
          {canRemove && (
            <div className="d-flex justify-content-center" style={{ width: 48 }}>
              <RemoveButton onClick={() => onRemoveChoice(choice.id)} />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

// export const Authoring = connect(null, (dispatch) => ({
//   onEditChoiceContent: (id: ChoiceId, content: RichText) =>
//     dispatch(choicesSlice.actions.editChoiceContent({ id, content })),
//   onRemoveChoice: (id: ChoiceId) => dispatch(choicesSlice.actions.removeChoice(id)),
// }))(Component);
