import guid from 'utils/guid';
import * as ContentModel from 'data/content/model';
import { AdaptiveModelSchema } from './schema';
import { RichText } from '../types';
import { ScoringStrategy } from '../common/authoring/parts/types';

export const defaultModel: () => AdaptiveModelSchema = () => {
  return {
    content: {},
    authoring: {
      parts: [
        {
          id: '1', // One part for now
          scoringStrategy: ScoringStrategy.average,
          responses: [],
          outcomes: [
            {
              id: 'outcome1',
              rule: [],
              actions: [{ id: 'action1', type: 'StateUpdateActionDesc', update: {} }],
            },
          ],
          hints: [contentFromText(''), contentFromText(''), contentFromText('')],
        },
      ],
      transformations: [],
      previewText: '',
    },
  };
};

export function contentFromText(text: string): { id: string; content: RichText } {
  return {
    id: guid() + '',
    content: {
      model: [
        ContentModel.create<ContentModel.Paragraph>({
          type: 'p',
          children: [{ text }],
          id: guid() + '',
        }),
      ],
      selection: null,
    },
  };
}

export const feedback = (text: string, match: string | number, score = 0) => ({
  ...contentFromText(text),
  match,
  score,
});
