import { Choice } from 'components/activities/types';
import { WriterContext } from 'data/content/writers/context';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import React from 'react';

interface Props {
  choice: Choice;
  index: number;
  selected: boolean;
  context: WriterContext;
  onClick: () => void;
  isEvaluated: boolean;
  unselectedIcon: JSX.Element;
  selectedIcon: JSX.Element;
}
export const DisplayedChoice = ({
  choice,
  index,
  selected,
  context,
  onClick,
  isEvaluated,
  unselectedIcon,
  selectedIcon,
}: Props) => {
  return (
    <div
      key={choice.id}
      aria-label={`choice ${index + 1}`}
      onClick={isEvaluated ? undefined : onClick}
      className={`choice ${selected ? 'selected' : ''}`}
    >
      {selected ? selectedIcon : unselectedIcon}
      <HtmlContentModelRenderer text={choice.content} context={context} />
    </div>
  );
};
