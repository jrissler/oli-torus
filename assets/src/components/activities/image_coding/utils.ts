import { makeFeedback } from 'data/content/activities/feedback';
import { makeHint } from 'data/content/activities/hint';
import { ScoringStrategy } from 'data/content/activities/part';
import { makeStem } from 'data/content/activities/stem';
import { ImageCodingModelSchema } from './schema';

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
