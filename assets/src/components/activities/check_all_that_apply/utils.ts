import {
  Operation,
  ScoringStrategy,
  ChoiceId,
  HasTargetedFeedback,
  ChoiceIdsToResponseId,
  HasTargetedFeedbackEnabled,
  HasParts,
} from '../types';
import { ID } from 'data/content/model';
import {
  getResponse,
  makeChoice,
  makeHint,
  makeResponse,
  makeStem,
  transformation,
} from 'components/activities/common/authoring/utils';
import { CheckAllThatApplyModelSchema as CATA } from 'components/activities/check_all_that_apply/schema';

// Choices
export const getChoiceIds = ([choiceIds]: ChoiceIdsToResponseId) => choiceIds;
export const getCorrectChoiceIds = (model: CATA) => getChoiceIds(model.authoring.correct);
export const getIncorrectChoiceIds = (model: CATA) => getChoiceIds(model.authoring.incorrect);
export const getTargetedChoiceIds = (model: { authoring: HasTargetedFeedbackEnabled }) =>
  model.authoring.targetedFeedback.map(getChoiceIds);
export const isCorrectChoice = (model: CATA, choiceId: ChoiceId) =>
  getCorrectChoiceIds(model).includes(choiceId);

// Responses
export const getResponseId = ([, responseId]: ChoiceIdsToResponseId) => responseId;
export const getCorrectResponse = (model: CATA) =>
  getResponse(model, getResponseId(model.authoring.correct));
export const getIncorrectResponse = (model: CATA) =>
  getResponse(model, getResponseId(model.authoring.incorrect));
export const getTargetedResponses = (model: { authoring: HasTargetedFeedbackEnabled & HasParts }) =>
  model.authoring.targetedFeedback.map((assoc) => getResponse(model, getResponseId(assoc)));

// Rules
export const createRuleForIds = (toMatch: ID[], notToMatch: ID[]) =>
  unionRules(
    toMatch.map(createMatchRule).concat(notToMatch.map((id) => invertRule(createMatchRule(id)))),
  );
export const createMatchRule = (id: string) => `input like {${id}}`;
export const invertRule = (rule: string) => `(!(${rule}))`;
export const unionTwoRules = (rule1: string, rule2: string) => `${rule2} && (${rule1})`;
export const unionRules = (rules: string[]) => rules.reduce(unionTwoRules);

// Other
export function setDifference<T>(subtractedFrom: T[], toSubtract: T[]): T[] {
  return subtractedFrom.filter((x) => !toSubtract.includes(x));
}

// Model creation
export const defaultCATAModel: () => CATA = () => {
  const correctChoice = makeChoice('Choice 1');
  const incorrectChoice = makeChoice('Choice 2');

  const correctResponse = makeResponse(
    createRuleForIds([correctChoice.id], [incorrectChoice.id]),
    1,
    '',
  );
  const incorrectResponse = makeResponse(invertRule(correctResponse.rule), 0, '');

  return {
    stem: makeStem(''),
    choices: [correctChoice, incorrectChoice],
    authoring: {
      targetedFeedback: undefined,
      parts: [
        {
          id: '1', // a only has one part, so it is safe to hardcode the id
          scoringStrategy: ScoringStrategy.average,
          responses: [correctResponse, incorrectResponse],
          hints: [makeHint(''), makeHint(''), makeHint('')],
        },
      ],
      correct: [[correctChoice.id], correctResponse.id],
      incorrect: [[incorrectChoice.id], incorrectResponse.id],
      transformations: [transformation('choices', Operation.shuffle)],
      previewText: '',
    },
  };
};
