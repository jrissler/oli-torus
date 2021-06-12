import { ChoiceId, ContentItem, HintId, ResponseId } from 'components/activities/types';
import * as ContentModel from 'data/content/model';
import guid from 'utils/guid';
import { HasChoices, IChoice } from '../choices/types';
import { HasHints, IHint } from '../hints/types';
import { HasParts } from './parts/types';
import { IResponse } from './responses/types';
import { HasTransformations, IOperation, ITransformation } from './transformations/types';

export function makeContent(text: string): ContentItem {
  return {
    id: guid(),
    content: {
      model: [
        ContentModel.create<ContentModel.Paragraph>({
          type: 'p',
          children: [{ text }],
          id: guid(),
        }),
      ],
      selection: null,
    },
  };
}

// Unsafe -> assumes the ID exists within the given list
export const unsafeGetById = <T extends ContentModel.Identifiable>(slice: T[], id: string): T =>
  slice.find((c) => c.id === id) || slice[0];

// Choices
export type ChoiceMoveDirection = 'up' | 'down';
export const getChoice = (schema: HasChoices, id: ChoiceId) =>

  unsafeGetById<IChoice>(schema.choices, id);
export const getChoiceIndex = (model: HasChoices, id: ChoiceId) =>
  model.choices.findIndex((choice) => choice.id === id);
export const canMoveChoice = (model: HasChoices, id: ChoiceId, direction: ChoiceMoveDirection) => {
  const firstChoiceIndex = 0;
  const lastChoiceIndex = model.choices.length - 1;
  const thisChoiceIndex = getChoiceIndex(model, id);

  const canMoveUp = thisChoiceIndex > firstChoiceIndex;
  const canMoveDown = thisChoiceIndex < lastChoiceIndex;

  switch (direction) {
    case 'up':
      return canMoveUp;
    case 'down':
      return canMoveDown;
  }
};
export const canMoveChoiceUp = (model: HasChoices, id: ChoiceId) => canMoveChoice(model, id, 'up');
export const canMoveChoiceDown = (model: HasChoices, id: ChoiceId) =>
  canMoveChoice(model, id, 'down');

export const areAnswerChoicesShuffled = (model: HasTransformations): boolean =>
  !!model.authoring.transformations.find((xform) => xform.operation === IOperation.shuffle);

// Responses
// Only for activity types with one part
export const getResponses = (model: HasParts) => model.authoring.parts[0].responses;
export const getResponse = (model: HasParts, id: ResponseId) =>
  unsafeGetById<IResponse>(getResponses(model), id);

// Hints
// Only for activity types with one part
export const getHints = (model: HasHints) => model.authoring.parts[0].hints;
export const getHint = (model: HasHints, id: HintId) => unsafeGetById<IHint>(getHints(model), id);

export const isShuffled = (transformations: ITransformation[]) =>
  !!transformations.find((xform) => xform.operation === IOperation.shuffle);

export const getTransformations = (model: HasTransformations) => model.authoring.transformations;

// Targeted Feedback
