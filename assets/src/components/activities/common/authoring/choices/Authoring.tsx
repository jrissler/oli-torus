import React, { useState } from 'react';
import { Choice as ChoiceType, ChoiceId, HasChoices, RichText } from '../../../types';
import { Choice } from 'components/activities/common/authoring/choices/Choice';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
  addChoice,
  editChoice,
  editChoices,
  removeChoice,
} from 'components/activities/common/authoring/actions/choices';

interface Props {
  icon: JSX.Element;

  // Managed by AuthoringElementContext
  choices?: ChoiceType[];
  addChoice?: () => void;
  editChoiceContent?: (id: ChoiceId, content: RichText) => void;
  editChoices?: (choices: ChoiceType[]) => void;
  removeChoice?: (id: ChoiceId) => void;
}
export const Authoring = (props: Props) => {
  const { model, dispatch } = useAuthoringElementContext<HasChoices>();

  const choices = props.choices || model.choices;
  const onAddChoice = props.addChoice || (() => dispatch(addChoice()));
  const onEditChoiceContent =
    props.editChoiceContent || ((id, content) => dispatch(editChoice(id, content)));
  const onEditChoices = props.editChoices || ((choices) => dispatch(editChoices(choices)));
  const onRemoveChoice =
    props.removeChoice || ((id) => dispatch(removeChoice((response, id2) => id === id2)(id)));

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

          dispatch((model) => {
            model.choices = newChoices;
          });
        }}
      >
        <Droppable droppableId={'choices'}>
          {(provided) => (
            <div {...provided.droppableProps} className="mt-3" ref={provided.innerRef}>
              {choices.map((choice, index) => (
                <Choice
                  icon={props.icon}
                  key={index + 'choice'}
                  index={index}
                  choice={choice}
                  editChoiceContent={onEditChoiceContent}
                  removeChoice={onRemoveChoice}
                  canRemove={choices.length > 1}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="d-flex align-items-center" style={{ marginLeft: '32px' }}>
        <AuthoringButton className="btn btn-link pl-2" onClick={addChoice}>
          Add choice
        </AuthoringButton>
      </div>
    </>
  );
};
