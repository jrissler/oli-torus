import {
  OrderingModelSchema as Ordering,
  ChoiceIdsToResponseId,
  TargetedOrdering,
  SimpleOrdering,
} from './schema';
import { ID } from 'data/content/model';
import { getResponse, getResponses } from '../common/authoring/utils';
import { makeChoice } from 'data/content/activities/choice';
import { makeResponse } from 'data/content/activities/response';
import { makeStem } from 'data/content/activities/stem';
import { makeHint } from 'data/content/activities/hint';
import { ScoringStrategy } from 'data/content/activities/part';
import { IOperation, makeTransformation } from 'data/content/activities/transformation';

// Types
export function isSimpleOrdering(model: Ordering): model is SimpleOrdering {
  return model.type === 'SimpleOrdering';
}
export function isTargetedOrdering(model: Ordering): model is TargetedOrdering {
  return model.type === 'TargetedOrdering';
}

// Choices
export const getChoiceIds = ([choiceIds]: ChoiceIdsToResponseId) => choiceIds;
export const getCorrectOrdering = (model: Ordering) => getChoiceIds(model.authoring.correct);
export const getTargetedChoiceIds = (model: TargetedOrdering) =>
  model.authoring.targeted.map(getChoiceIds);

// Responses
export const getResponseId = ([, responseId]: ChoiceIdsToResponseId) => responseId;
export const getCorrectResponse = (model: Ordering) =>
  getResponse(model, getResponseId(model.authoring.correct));
export const getIncorrectResponse = (model: Ordering) => {
  const responsesWithoutCorrect = getResponses(model).filter(
    (response) => getCorrectResponse(model).id !== response.id,
  );

  switch (model.type) {
    case 'SimpleOrdering':
      return responsesWithoutCorrect[0];
    case 'TargetedOrdering':
      return responsesWithoutCorrect.filter(
        (r1) => !getTargetedResponses(model).find((r2) => r1.id === r2.id),
        (r1: any) => !getTargetedResponses(model).find((r2) => r1.id === r2.id),
      )[0];
  }
};
export const getTargetedResponses = (model: TargetedOrdering) =>
  model.authoring.targeted.map((assoc) => getResponse(model, getResponseId(assoc)));

// Rules
// a default rule that never matches
export const makeEmptyRule = () => `!input like {}`;
export const createMatchRule = (id: ID) => `input like {${id}}`;
export const createRuleForIds = (orderedIds: ID[]) => `input like {${orderedIds.join(' ')}}`;
export const invertRule = (rule: string) => `(!(${rule}))`;
export const unionTwoRules = (rule1: string, rule2: string) => `${rule2} && (${rule1})`;
export const unionRules = (rules: string[]) => rules.reduce(unionTwoRules);

// Other
export function setDifference<T>(subtractedFrom: T[], toSubtract: T[]) {
  return subtractedFrom.filter((x) => !toSubtract.includes(x));
}

// Model creation
export const defaultOrderingModel = (): Ordering => {
  const choice1 = makeChoice('Choice 1');
  const choice2 = makeChoice('Choice 2');

  const correctResponse = makeResponse(createRuleForIds([choice1.id, choice2.id]), 1, '');
  const incorrectResponse = makeResponse(invertRule(correctResponse.rule), 0, '');

  return {
    type: 'SimpleOrdering',
    stem: makeStem(''),
    choices: [choice1, choice2],
    authoring: {
      parts: [
        {
          id: '1', // a only has one part, so it is safe to hardcode the id
          scoringStrategy: ScoringStrategy.average,
          responses: [correctResponse, incorrectResponse],
          hints: [makeHint(''), makeHint(''), makeHint('')],
        },
      ],
      correct: [[choice1.id, choice2.id], correctResponse.id],
      transformations: [makeTransformation('choices', IOperation.shuffle)],
      previewText: '',
    },
  };
};
