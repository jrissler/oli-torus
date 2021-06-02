import React from 'react';
import { Choice as ChoiceType, ChoiceId, HasChoices, RichText } from '../../types';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { orIdentity, useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getChoice, makeChoice } from 'components/activities/common/authoring/utils';
import produce from 'immer';
import { Choice } from './choice';

export function useChoices() {
  const {
    model: { choices },
    dispatch,
  } = useAuthoringElementContext<HasChoices>();

  return {
    choices,
    dispatch,
    addChoice: () => produce<HasChoices>((draft) => void draft.choices.push(makeChoice(''))),
    editChoiceContent: (id: ChoiceId, content: RichText) =>
      produce<HasChoices>((draft) => void (getChoice(draft, id).content = content)),
    editChoices: (choices: ChoiceType[]) =>
      produce<HasChoices>((draft) => void (draft.choices = choices)),
    removeChoice: (id: ChoiceId) =>
      produce<HasChoices>(
        (draft) => void (draft.choices = draft.choices.filter((c) => c.id !== id)),
      ),
  };
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
export const Authoring = (props: Props) => {
  const { choices, addChoice, editChoiceContent, editChoices, removeChoice, dispatch } =
    useChoices();
  const { onAddChoice, onEditChoiceContent, onEditChoices, onRemoveChoice } = props;

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

          onEditChoices ? onEditChoices(newChoices) : dispatch(editChoices(newChoices));
        }}
      >
        <Droppable droppableId={'choices'}>
          {(provided) => (
            <div {...provided.droppableProps} className="mt-3" ref={provided.innerRef}>
              {choices.map((choice, index) => (
                <Choice.Authoring
                  icon={props.icon}
                  key={index + 'choice'}
                  index={index}
                  choice={choice}
                  editChoiceContent={(id, content) =>
                    onEditChoiceContent
                      ? onEditChoiceContent(id, content)
                      : dispatch(editChoiceContent(id, content))
                  }
                  removeChoice={(id) =>
                    onRemoveChoice ? onRemoveChoice(id) : dispatch(removeChoice(id))
                  }
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
          onClick={() => dispatch(addChoice(), orIdentity(onAddChoice)())}
        >
          Add choice
        </AuthoringButton>
      </div>
    </>
  );
};
