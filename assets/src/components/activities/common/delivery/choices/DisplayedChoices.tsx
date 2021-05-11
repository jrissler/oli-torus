import { Choice, ChoiceId } from 'components/activities/types';
import { WriterContext } from 'data/content/writers/context';
import { DisplayedChoice } from 'components/activities/common/delivery/choices/DisplayedChoice';
import React from 'react';

interface Props {
  choices: Choice[];
  selected: ChoiceId[];
  context: WriterContext;
  onSelect: (id: ChoiceId) => void;
  isEvaluated: boolean;
  unselectedIcon: JSX.Element;
  selectedIcon: JSX.Element;
}
export const DisplayedChoices = ({
  choices,
  selected,
  context,
  onSelect,
  isEvaluated,
  unselectedIcon,
  selectedIcon,
}: Props) => {
  const isSelected = (choiceId: ChoiceId) => !!selected.find((s) => s === choiceId);
  return (
    <div className="choices" aria-label="check all that apply choices">
      {choices.map((choice, index) => (
        <DisplayedChoice
          unselectedIcon={unselectedIcon}
          selectedIcon={selectedIcon}
          key={choice.id}
          onClick={() => onSelect(choice.id)}
          selected={isSelected(choice.id)}
          choice={choice}
          isEvaluated={isEvaluated}
          index={index}
          context={context}
        />
      ))}
    </div>
  );
};
