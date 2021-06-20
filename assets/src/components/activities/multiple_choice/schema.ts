import { ActivityModelSchema } from 'data/content/activities/activity';
import { IChoice, makeChoice } from 'data/content/activities/choice';
import { makeHint } from 'data/content/activities/hint';
import { IPart, ScoringStrategy } from 'data/content/activities/part';
import { makeResponse } from 'data/content/activities/response';
import { IStem, makeStem } from 'data/content/activities/stem';
import { IOperation, ITransformation } from 'data/content/activities/transformation';
import { ResponseMappings } from '../common/authoring/responseChoices/responseChoicesSlice';
import { createRuleForIds, invertRule } from '../common/authoring/responses/rules';
import { makeTransformation } from '../common/utils';

export interface MCSchema extends ActivityModelSchema {
  stem: IStem;
  choices: IChoice[];
  authoring: {
    previewText: string;
    transformations: ITransformation[];
    parts: IPart[];
    // Responses don't have a tie to the choices that trigger them,
    // so we make a relationship table to keep track of the mappings
    responseMappings: ResponseMappings[];
  };
}

export const defaultMCModel: () => MCSchema = () => {
  const correctChoice = makeChoice('Choice A');
  const incorrectChoice = makeChoice('Choice B');

  const correctResponse = makeResponse(
    createRuleForIds([correctChoice.id], [incorrectChoice.id]),
    1,
    '',
  );
  const incorrectResponse = makeResponse(invertRule(correctResponse.rule), 0, '');
  const PART_ID = '1'; // only has one part, so it is safe to hardcode the id

  return {
    stem: makeStem(''),
    choices: [correctChoice, incorrectChoice],
    authoring: {
      parts: [
        {
          id: PART_ID,
          scoringStrategy: ScoringStrategy.average,
          responses: [correctResponse, incorrectResponse],
          hints: [makeHint(''), makeHint(''), makeHint('')],
        },
      ],
      transformations: [makeTransformation('choices', IOperation.shuffle)],
      previewText: '',
      responseMappings: [
        {
          partId: PART_ID,
          correct: { responseId: correctResponse.id, choiceIds: [correctChoice.id] },
          targeted: [],
          incorrect: { responseId: incorrectResponse.id },
        },
      ],
    },
  };
};
