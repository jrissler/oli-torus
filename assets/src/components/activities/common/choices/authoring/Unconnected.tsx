import React from 'react';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Choice } from './choice';
import { IChoice } from '../types';

interface Props {
  icon: JSX.Element;

  choices: IChoice[];
  addOne: () => void;
  setAll: (choices: IChoice[]) => void;
}
export const Unconnected: React.FC<Props> = ({ icon, choices, addOne, setAll }) => {
  console.log('choices', choices);
  return (
    <>
      <DragDropContext
        onDragEnd={({ destination, source, draggableId }) => {
          if (!destination) {
            return;
          }
          if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
          ) {
            return;
          }

          const choice = choices[source.index];
          const newChoices = Array.from(choices);
          newChoices.splice(source.index, 1);
          newChoices.splice(destination.index, 0, choice);

          setAll(newChoices);
        }}
      >
        <Droppable droppableId={'choices'}>
          {(provided) => (
            <div {...provided.droppableProps} className="mt-3" ref={provided.innerRef}>
              {choices.map((choice, index) => (
                <Choice.Authoring.Connected
                  icon={icon}
                  key={index + 'choice'}
                  index={index}
                  choice={choice}
                  canRemove={choices.length > 1}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="d-flex align-items-center" style={{ marginLeft: '32px' }}>
        <AuthoringButton className="btn btn-link pl-2" onClick={addOne}>
          Add choice
        </AuthoringButton>
      </div>
    </>
  );
};
Unconnected.displayName = 'ChoicesAuthoringEditor';
