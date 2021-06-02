import { Choice as ChoiceT, ChoiceId } from 'components/activities/types';
import { WriterContext } from 'data/content/writers/context';
import { Choice } from 'components/activities/common/choices/choice';
import React from 'react';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import './Choices.scss';

interface Props {
  choices: ChoiceT[];
  selected: ChoiceId[];
  context: WriterContext;
  onSelect: (id: ChoiceId) => void;
  isEvaluated: boolean;
  unselectedIcon: JSX.Element;
  selectedIcon: JSX.Element;
}
export const Delivery = ({
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
    <div className="choices__container" aria-label="answer choices">
      {choices.map((choice, index) => (
        <div
          key={choice.id}
          aria-label={`choice ${index + 1}`}
          onClick={isEvaluated ? undefined : () => onSelect(choice.id)}
          className={`choices__choice-row ${isSelected(choice.id) ? 'selected' : ''}`}
        >
          <div className="choices__choice-content">
            <label className="choices__choice-label" htmlFor={`choice-${index}`}>
              <div className="d-flex align-items-center flex-shrink-1">
                {isSelected(choice.id) ? selectedIcon : unselectedIcon}
                <HtmlContentModelRenderer text={choice.content} context={context} />
              </div>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};
