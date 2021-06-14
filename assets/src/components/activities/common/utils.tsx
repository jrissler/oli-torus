import * as ContentModel from 'data/content/model';
import guid from 'utils/guid';
import React from 'react';
import { isShuffled } from './authoring/utils';
import { IOperation, ITransformation } from './authoring/transformations/types';
import {  RichText  } from '../types';;

export function fromText(text: string): { id: string; content: RichText } {
  return {
    id: guid() + '',
    content: {
      model: [
        ContentModel.create<ContentModel.Paragraph>({
          type: 'p',
          children: [{ text }],
          id: guid() + '',
        }),
      ],
      selection: null,
    },
  };
}

export const makeTransformation = (path: string, operation: IOperation): ITransformation => ({
  id: guid(),
  path,
  operation,
});

export const toggleAnswerChoiceShuffling = () => {
  return (model: { authoring: { transformations: ITransformation[] } }): void => {
    const transformations = model.authoring.transformations;

    isShuffled(transformations)
      ? (model.authoring.transformations = transformations.filter(
          (xform) => xform.operation !== IOperation.shuffle,
        ))
      : model.authoring.transformations.push(makeTransformation('choices', IOperation.shuffle));
  };
};

interface ShuffleChoicesOptionProps {
  onShuffle: () => void;
  model: { authoring: { transformations: ITransformation[] } };
}
export const ShuffleChoicesOption: React.FC<ShuffleChoicesOptionProps> = ({
  onShuffle,
  model,
}: ShuffleChoicesOptionProps) => (
  <div className="form-check mb-2">
    <input
      onChange={onShuffle}
      className="form-check-input"
      type="checkbox"
      value=""
      checked={isShuffled(model.authoring.transformations)}
      id="shuffle-choices"
    />
    <label className="form-check-label" htmlFor="shuffle-choices">
      Shuffle answer choices
    </label>
  </div>
);
