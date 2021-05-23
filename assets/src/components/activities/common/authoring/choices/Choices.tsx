import React, { useReducer } from 'react';
import { Choice as ChoiceType, ChoiceId, HasChoices, RichText } from '../../../types';
import { Choice } from 'components/activities/common/authoring/choices/Choice';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getChoice, makeChoice } from 'components/activities/common/authoring/utils';
import produce from 'immer';

type ChoiceActions =
  | { type: 'ADD_CHOICE' }
  | { type: 'EDIT_CHOICE_CONTENT'; id: ChoiceId; content: RichText }
  | { type: 'EDIT_CHOICES'; choices: ChoiceType[] }
  | { type: 'REMOVE_CHOICE'; id: ChoiceId };

export function choicesReducer(draft: HasChoices, action: ChoiceActions) {
  switch (action.type) {
    case 'ADD_CHOICE':
      console.log('adding choice');
      draft.choices.push(makeChoice(''));
      break;

    case 'EDIT_CHOICE_CONTENT':
      getChoice(draft, action.id).content = action.content;
      break;

    case 'EDIT_CHOICES':
      draft.choices = action.choices;
      break;

    case 'REMOVE_CHOICE':
      draft.choices = draft.choices.filter((c) => c.id !== action.id);
      break;
  }
}

export function useChoices({ reducer = choicesReducer } = {}) {
  const { model } = useAuthoringElementContext<HasChoices>(choicesReducer);

  const [{ choices }, dispatch] = useReducer(produce(reducer), model);

  const addChoice = () => dispatch({ type: 'ADD_CHOICE' });
  const editChoiceContent = (id: ChoiceId, content: RichText) =>
    dispatch({ type: 'EDIT_CHOICE_CONTENT', id, content });
  const editChoices = (choices: ChoiceType[]) => dispatch({ type: 'EDIT_CHOICES', choices });
  const removeChoice = (id: ChoiceId) => dispatch({ type: 'REMOVE_CHOICE', id });

  return { choices, addChoice, editChoiceContent, editChoices, removeChoice };
}

// model.authoring.parts[0].responses = model.authoring.parts[0].responses.filter((response) =>
// responsePredicate(response, id),

interface Props {
  icon: JSX.Element;

  onAddChoice?: () => void;
  onEditChoiceContent?: (id: ChoiceId, content: RichText) => void;
  onEditChoices?: (choices: ChoiceType[]) => void;
  onRemoveChoice?: (id: ChoiceId) => void;
}
export const Choices = (props: Props) => {
  const { choices, addChoice, editChoiceContent, editChoices, removeChoice } = useChoices();

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

          editChoices(newChoices);
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
                  editChoiceContent={editChoiceContent}
                  removeChoice={props.onRemoveChoice}
                  canRemove={choices.length > 1}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="d-flex align-items-center" style={{ marginLeft: '32px' }}>
        <AuthoringButton
          className="btn btn-link pl-2"
          onClick={() => {
            console.log(addChoice(), 'Adding choice');
            props.onAddChoice && props.onAddChoice();
          }}
        >
          Add choice
        </AuthoringButton>
      </div>
    </>
  );
};
