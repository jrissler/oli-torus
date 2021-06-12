import { WriterContext } from 'data/content/writers/context';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import React from 'react';
import { IChoice } from '../../types';
interface ChoiceProps {
  choice: IChoice;
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
