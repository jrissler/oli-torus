import { Operation, ScoringStrategy, ChoiceIdsToResponseId } from '../types';
import {
  makeChoice,
  makeHint,
  makeResponse,
  makeStem,
} from 'components/activities/common/authoring/utils';
import { CheckAllThatApplyModelSchemaV2 } from 'components/activities/check_all_that_apply/schema';
import { makeTransformation } from 'components/activities/common/utils';
import { createRuleForIds, invertRule } from '../common/authoring/feedback/TargetedFeedback';

export const defaultCATAModel = (): CheckAllThatApplyModelSchemaV2 => {
  const correctChoice = makeChoice('Choice 1');
  const incorrectChoice = makeChoice('Choice 2');

  const correctResponse = makeResponse(
    createRuleForIds([correctChoice.id], [incorrectChoice.id]),
    1,
    '',
  );
  const incorrectResponse = makeResponse(invertRule(correctResponse.rule), 0, '');

  return {} as any;

  // return {
  //   stem: makeStem(''),
  //   choices: [correctChoice, incorrectChoice],
  //   authoring: {
  //     parts: [
  //       {
  //         id: '1', // only has one part, so it is safe to hardcode the id
  //         scoringStrategy: ScoringStrategy.average,
  //         responses: [correctResponse, incorrectResponse],
  //         hints: [makeHint(''), makeHint(''), makeHint('')],
  //       },
  //     ],
  //     feedback: {
  //       type: 'TargetedFeedbackDisabled',
  //       correct: [[correctChoice.id], correctResponse.id] as ChoiceIdsToResponseId,
  //       incorrect: [[incorrectChoice.id], incorrectResponse.id] as ChoiceIdsToResponseId,
  //       targeted: [],
  //     },
  //     transformations: [makeTransformation('choices', Operation.shuffle)],
  //     previewText: '',
  //   },
  // };
};
