import { MultipleChoiceModelSchema } from './schema';
import { Choice, HasChoices, HasParts, Response, ScoringStrategy } from '../types';
import {
  makeChoice,
  makeHint,
  makeResponse,
  makeStem,
} from 'components/activities/common/authoring/utils';

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

const isCorrect = (response: Response) => response.score === 1;

export const correctChoice = (model: HasChoices & HasParts) =>
  model.choices.reduce((correct, choice) => {
    const responseMatchesChoice = (response: Response, choice: Choice) =>
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
