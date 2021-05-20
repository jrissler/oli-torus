import React from 'react';
import { Choice as ChoiceType, HasChoices, RichText } from 'components/activities/types';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RemoveButton } from 'components/misc/RemoveButton';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { Draggable, DraggingStyle, Droppable, NotDraggingStyle } from 'react-beautiful-dnd';
import { editChoice, removeChoice } from 'components/activities/common/authoring/actions/choices';

interface Props {
  choice: ChoiceType;
  canRemove: boolean;
  icon: JSX.Element;
  index: number;

  // Managed by AuthoringElement context
  editChoiceContent?: (id: string, content: RichText) => void;
  removeChoice?: (id: string) => void;
}
export const Choice = (props: Props) => {
  const { choice, canRemove, icon, index } = props;
  const { dispatch } = useAuthoringElementContext<HasChoices>();

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
            onEdit={(content) =>
              (props.editChoiceContent && props.editChoiceContent(choice.id, content)) ||
              dispatch(editChoice(choice.id, content))
            }
          />
          {canRemove && (
            <div className="d-flex justify-content-center" style={{ width: 48 }}>
              <RemoveButton
                onClick={() =>
                  (props.removeChoice && props.removeChoice(choice.id)) ||
                  dispatch(removeChoice((response, id2) => choice.id === id2)(choice.id))
                }
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
