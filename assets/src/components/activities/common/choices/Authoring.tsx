import React from 'react';
import { Choice as ChoiceType, ChoiceId, HasChoices, RichText } from '../../types';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { orIdentity, useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getChoice, makeChoice } from 'components/activities/common/authoring/utils';
import produce from 'immer';
import { Choice } from './choice';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { connect } from 'react-redux';

// export function useChoices() {
//   const {
//     model: { choices },
//     dispatch,
//   } = useAuthoringElementContext<HasChoices>();

//   return {
//     choices,
//     dispatch,
//     addChoice: () => produce<HasChoices>((draft) => void draft.choices.push(makeChoice(''))),
//     editChoiceContent: (id: ChoiceId, content: RichText) =>
//       produce<HasChoices>((draft) => void (getChoice(draft, id).content = content)),
//     editChoices: (choices: ChoiceType[]) =>
//       produce<HasChoices>((draft) => void (draft.choices = choices)),
//     removeChoice: (id: ChoiceId) =>
//       produce<HasChoices>(
//         (draft) => void (draft.choices = draft.choices.filter((c) => c.id !== id)),
//       ),
//   };
// }

// export const choicesAdapter = createEntityAdapter<ChoiceType>();

export const choicesSlice = createSlice({
  name: 'choices',
  initialState: [] as ChoiceType[],
  reducers: {
    // addChoice: choicesAdapter.addOne,
    // editChoices: choicesAdapter.setAll,
    // removeChoice: choicesAdapter.removeOne,
    // editChoiceContent: choicesAdapter.updateOne,
    addChoice(state) {
      state.push(makeChoice(''));
    },
    editChoiceContent(state, action: PayloadAction<{ id: ChoiceId; content: RichText }>) {
      const choice = state.find(({ id }) => id === action.payload.id);
      if (choice) {
        choice.content = action.payload.content;
      }
    },
    editChoices(state, action: PayloadAction<ChoiceType[]>) {
      return action.payload;
    },
    removeChoice(state, action: PayloadAction<ChoiceId>) {
      return state.filter((c) => c.id !== action.payload);
    },
  },
});

interface Props {
  icon: JSX.Element;

  choices: ChoiceType[];
  onAddChoice: () => void;
  onEditChoiceContent: (id: ChoiceId, content: RichText) => void;
  onEditChoices: (choices: ChoiceType[]) => void;
  onRemoveChoice: (id: ChoiceId) => void;
}
const Component = ({
  icon,
  choices,
  onAddChoice,
  onEditChoiceContent,
  onEditChoices,
  onRemoveChoice,
}: Props) => {
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

          onEditChoices(newChoices);
        }}
      >
        <Droppable droppableId={'choices'}>
          {(provided) => (
            <div {...provided.droppableProps} className="mt-3" ref={provided.innerRef}>
              {choices.map((choice, index) => (
                <Choice.Authoring
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
        <AuthoringButton className="btn btn-link pl-2" onClick={onAddChoice}>
          Add choice
        </AuthoringButton>
      </div>
    </>
  );
};

export const Authoring = connect(
  (state: HasChoices) => ({ choices: state.choices }),
  (dispatch) => ({
    onAddChoice: () => dispatch(choicesSlice.actions.addChoice()),
    onEditChoiceContent: (id: ChoiceId, content: RichText) =>
      dispatch(choicesSlice.actions.editChoiceContent({ id, content })),
    onEditChoices: (choices: ChoiceType[]) => dispatch(choicesSlice.actions.editChoices(choices)),
    onRemoveChoice: (id: ChoiceId) => dispatch(choicesSlice.actions.removeChoice(id)),
  }),
)(Component);
