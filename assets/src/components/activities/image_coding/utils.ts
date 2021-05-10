import { ImageCodingModelSchema } from './schema';
import { ScoringStrategy } from '../types';
import { makeFeedback, makeHint, makeStem } from 'components/activities/common/authoring/utils';

export const defaultICModel: () => ImageCodingModelSchema = () => {
  return {
    stem: makeStem(''),
    isExample: false,
    starterCode: 'Sample Starter Code',
    solutionCode: 'Sample Solution Code',
    resourceURLs: [],
    tolerance: 1.0,
    regex: '', // from original, not clear how used or if needed
    feedback: [
      // order matters: feedback[score] is used for score in {0, 1}
      makeFeedback('Incorrect'),
      makeFeedback('Correct'),
    ],
    authoring: {
      parts: [
        {
          id: '1', // an IC only has one part, so it is safe to hardcode the id
          scoringStrategy: ScoringStrategy.average,
          responses: [],
          hints: [makeHint(''), makeHint(''), makeHint('')],
        },
      ],
      previewText: '',
    },
  };
};

export function lastPart(path: string): string {
  return path.substring(path.lastIndexOf('/') + 1);
}
