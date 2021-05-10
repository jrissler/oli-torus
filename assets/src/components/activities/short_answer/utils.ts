import { ShortAnswerModelSchema } from './schema';
import { ScoringStrategy } from '../types';
import { makeHint, makeResponse, makeStem } from 'components/activities/common/authoring/utils';

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
