import React from 'react';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { defaultWriterContext } from 'data/content/writers/context';
import { Stem } from '../stem/Stem';
import { ChoiceId, HasChoices, HasStem, HasTargetedFeedback } from 'components/activities/types';
import { Choices } from '../choices';
import produce, { Draft } from 'immer';
import { getChoiceIds } from './feedback/TargetedFeedback';

export const useAnswerKey = () => {
  const { model, dispatch } =
    useAuthoringElementContext<HasStem & HasChoices & HasTargetedFeedback>();

  function removeFromList<T>(item: T, list: T[]) {
    const index = list.findIndex((x) => x === item);
    if (index > -1) {
      list.splice(index, 1);
    }
  }
  function addOrRemoveFromList<T>(item: T, list: T[]) {
    if (list.find((x) => x === item)) {
      return removeFromList(item, list);
    }
    return list.push(item);
  }

  const toggleCorrectness = (id: ChoiceId) =>
    produce((draft: Draft<HasChoices>) => {
      addOrRemoveFromList(id, getChoiceIds(model.authoring.feedback.correct));
      addOrRemoveFromList(id, getChoiceIds(model.authoring.feedback.incorrect));
    });

  return { model, dispatch, toggleCorrectness };
};
interface Props {
  correctChoiceIds: ChoiceId[];
  onToggleCorrectness?: (id: ChoiceId) => void;
}
export const AnswerKey: React.FC<Props> = ({ correctChoiceIds, onToggleCorrectness }) => {
  const { model, dispatch, toggleCorrectness } = useAnswerKey();
  return (
    <>
      <Stem.Delivery stem={model.stem} context={defaultWriterContext()} />

      <Choices.Delivery
        unselectedIcon={<i className="material-icons-outlined">check_box_outline_blank</i>}
        selectedIcon={<i className="material-icons-outlined">check_box</i>}
        choices={model.choices}
        selected={correctChoiceIds}
        onSelect={(id) =>
          onToggleCorrectness ? onToggleCorrectness(id) : dispatch(toggleCorrectness(id))
        }
        isEvaluated={false}
        context={defaultWriterContext()}
      />
    </>
  );
};
