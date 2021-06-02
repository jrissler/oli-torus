import { Choice as ChoiceT } from 'components/activities/types';
import { WriterContext } from 'data/content/writers/context';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import React from 'react';
interface ChoiceProps {
  choice: ChoiceT;
  index: number;
  selected: boolean;
  context: WriterContext;
  onClick: () => void;
  isEvaluated: boolean;
}

export const Delivery = ({
  choice,
  index,
  selected,
  context,
  onClick,
  isEvaluated,
}: ChoiceProps) => {
  return null;
};
