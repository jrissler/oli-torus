import { HasParts, ScoringStrategy } from '../common/authoring/parts/types';
import { IResponse, makeResponse } from '../common/authoring/responses/types';
import { HasChoices, IChoice, makeChoice } from '../common/choices/types';
import { makeHint } from '../common/hints/types';
import { makeStem } from '../common/stem/types';
import { MultipleChoiceModelSchema } from './schema';

export const defaultMCModel: () => MultipleChoiceModelSchema = () => {
  const choiceA = makeChoice('Choice A');
  const choiceB = makeChoice('Choice B');

  return {
    stem: makeStem(''),
    choices: [choiceA, choiceB],
    authoring: {
      parts: [
        {
          id: '1', // an MCQ only has one part, so it is safe to hardcode the id
          scoringStrategy: ScoringStrategy.average,
          responses: [
            makeResponse(`input like {${choiceA.id}}`, 1, ''),
            makeResponse(`input like {${choiceB.id}}`, 0, ''),
          ],
          hints: [makeHint(''), makeHint(''), makeHint('')],
        },
      ],
      transformations: [],
      previewText: '',
    },
  };
};

const isCorrect = (response: IResponse) => response.score === 1;

export const correctChoice = (model: HasChoices & HasParts) =>
  model.choices.reduce((correct, choice) => {
    const responseMatchesChoice = (response: IResponse, choice: IChoice) =>
      response.rule === `input like {${choice.id}}`;
    if (correct) return correct;

    if (
      model.authoring.parts[0].responses.find(
        (response) => responseMatchesChoice(response, choice) && isCorrect(response),
      )
    ) {
      return choice;
    }

    throw new Error('Correct choice could not be found:' + JSON.stringify(model.choices));
  });

export const incorrectChoices = (model: HasChoices & HasParts) =>
  model.choices.filter((choice) => choice.id !== correctChoice(model).id);
