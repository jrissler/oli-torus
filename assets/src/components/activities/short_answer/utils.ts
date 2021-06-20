import { makeHint } from 'data/content/activities/hint';
import { ScoringStrategy } from 'data/content/activities/part';
import { makeResponse } from 'data/content/activities/response';
import { makeStem } from 'data/content/activities/stem';
import { ShortAnswerModelSchema } from './schema';

export const parseInputFromRule = (rule: string) => {
  return rule.substring(rule.indexOf('{') + 1, rule.indexOf('}'));
};

export const defaultModel: () => ShortAnswerModelSchema = () => {
  return {
    stem: makeStem(''),
    inputType: 'text',
    authoring: {
      parts: [
        {
          id: '1', // an short answer only has one part, so it is safe to hardcode the id
          scoringStrategy: ScoringStrategy.average,
          responses: [
            makeResponse('input like {answer}', 1, ''),
            makeResponse('input like {.*}', 0, ''),
          ],
          hints: [makeHint(''), makeHint(''), makeHint('')],
        },
      ],
      transformations: [],
      previewText: '',
    },
  };
};
