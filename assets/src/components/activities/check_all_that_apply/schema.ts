import { makeTransformation } from 'components/activities/common/utils';
import { IPart, ScoringStrategy } from '../common/authoring/parts/types';
import { ResponseChoice } from '../common/authoring/responseChoices/responseChoicesSlice';
import { makeResponse } from '../common/authoring/responses/types';
import { IOperation, ITransformation } from '../common/authoring/transformations/types';
import { IChoice, makeChoice } from '../common/choices/types';
import { createRuleForIds, invertRule } from '../common/feedback/targeted/Unconnected';
import { makeHint } from '../common/hints/types';
import { IStem, makeStem } from '../common/stem/types';
import { ActivityModelSchema, ChoiceId, ResponseId } from '../types';

export interface CATASchema extends ActivityModelSchema {
  stem: IStem;
  choices: IChoice[];
  authoring: {
    previewText: string;
    transformations: ITransformation[];
    parts: IPart[];
    // Responses don't have a tie to the choices that trigger them,
    // so we make a relationship table to keep track of the mappings
    responsesChoices: ResponseChoice[];
    // Keep track of which choice IDs are "correct" or "incorrect" since the choice
    // itself is only meant to have delivery-friendly content.
    // This is used to update parts' response rules to match correct/incorrect answer choices.
    // choiceCorrectness: {
    //   correctChoiceIds: ChoiceId[];
    //   incorrectChoiceIds: ChoiceId[];
    // }; // HasMultipleCorrectChoices

    // feedback: HasTargetedFeedback['authoring']['feedback'];
  };
}

/*
1. No targeted feedback, no partial credit
  a. two responses -> one correct (score == 1), one incorrect (score != 1)
2. Targeted feedback, no partial credit
  a. many responses
    i. one correct (score == 1), many targeted to specific choices, one catch-all
2. Partial credit, no targeted feedback
  a. many responses
    i. each response has a score up to the total of the activity
    ii. many correct (score == out_of) targeted to specific choices, one catch-all
2. Partial credit, targeted feedback
  a. many responses
    i. same as 2ai
    ii. many correct (score == out_of) targeted to specific choices, one catch-all

partial credit is the same as targeted feedback as long as the targeted feedback can specify a score

*/

// export type CATASchema = ActivityModelSchema &
//   HasStem &
//   HasChoices &
//   HasPreviewText &
//   HasTransformations &
//   HasParts &
//   HasTargetedFeedback;

// Response[] => each response has a feedback
// a response can have many choices
// a choice can have many responses (need join table)
// a response may be correct (score === outof)

// non-targeted feedback:
// need a way to get correct / incorrect response (catchall)
// tie responses to the choice ids the rule is based on
//
// when toggling correctness, update correct/incorrect

// partial credit: may be multiple responses with score > 0

export const defaultCATAModel = (): CATASchema => {
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
      parts: [
        {
          id: '1', // only has one part, so it is safe to hardcode the id
          scoringStrategy: ScoringStrategy.average,
          responses: [correctResponse, incorrectResponse],
          hints: [makeHint(''), makeHint(''), makeHint('')],
        },
      ],

      // feedback: {
      //   type: <const>'TargetedFeedbackEnabled',
      //   correct: [[correctChoice.id], correctResponse.id] as ChoiceIdsToResponseId,
      //   incorrect: [[incorrectChoice.id], incorrectResponse.id] as ChoiceIdsToResponseId,
      //   targeted: [],
      // },
      transformations: [makeTransformation('choices', IOperation.shuffle)],
      previewText: '',
      // correctness: {
      //   correctChoiceIds: [correctChoice.id],
      //   incorrectChoiceIds: [incorrectChoice.id],
      // },

      // response/choices are M:M relationship. join table between them
      responsesChoices: [
        { choiceId: correctChoice.id, responseId: correctResponse.id },
        { choiceId: incorrectChoice.id, responseId: incorrectChoice.id },
      ],
    },
  };
};
