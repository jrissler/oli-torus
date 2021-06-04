import * as ContentModel from 'data/content/model';
import {
  ContentItem,
  Operation,
  Response,
  Transformation,
  Choice,
  Stem,
  Hint,
  Feedback,
  HasChoices,
  ChoiceId,
  ResponseId,
  HintId,
  HasTransformations,
  HasParts,
  HasTargetedFeedback,
  ActivityModelSchema,
} from '../../types';
import guid from 'utils/guid';

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
export const makeChoice: (text: string) => Choice = makeContent;
export const makeStem: (text: string) => Stem = makeContent;
export const makeHint: (text: string) => Hint = makeContent;
export const makeFeedback: (text: string) => Feedback = makeContent;

export const makeResponse = (rule: string, score: number, text: ''): Response => ({
  id: guid(),
  rule,
  score,
  feedback: makeFeedback(text),
});

export const makeTransformation = (path: string, operation: Operation): Transformation => ({
  id: guid(),
  path: 'choices',
  operation,
});

// Unsafe -> assumes the ID exists within the given list
export const unsafeGetById = <T extends ContentModel.Identifiable>(slice: T[], id: string): T =>
  slice.find((c) => c.id === id) || slice[0];

// Choices
export type ChoiceMoveDirection = 'up' | 'down';
export const getChoice = (schema: HasChoices, id: ChoiceId) =>
  unsafeGetById<Choice>(schema.choices, id);
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
  !!model.authoring.transformations.find((xform) => xform.operation === Operation.shuffle);

// Responses
// Only for activity types with one part
export const getResponses = (model: HasParts) => model.authoring.parts[0].responses;
export const getResponse = (model: HasParts, id: ResponseId) =>
  unsafeGetById<Response>(getResponses(model), id);

// Hints
// Only for activity types with one part
export const getHints = (model: HasParts) => model.authoring.parts[0].hints;
export const getHint = (model: HasParts, id: HintId) => unsafeGetById<Hint>(getHints(model), id);

export const isShuffled = (transformations: Transformation[]) =>
  !!transformations.find((xform) => xform.operation === Operation.shuffle);

export const getTransformations = (model: HasTransformations) => model.authoring.transformations;

// Targeted Feedback
