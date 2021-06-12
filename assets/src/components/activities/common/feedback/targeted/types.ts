// Targeted feedback works like this:
// `correct` holds the correct choice ids that map to the single correct response id.
// `incorrect` holds the incorrect choice ids that map to the single catch-all incorrect response id.
// `targeted` holds the choice ids that correspond to a specific targeted feedback response id (there may be multiple). An empty array means there is no targeted feedback, but the targeted feedback mode is "on." `targeted` being undefined means targeted feedback mode is off.

import { ChoiceId, ResponseId } from 'components/activities/types';
import { HasParts } from '../../authoring/parts/types';
import { HasChoices } from '../../choices/types';

export type ChoiceIdsToResponseId = [ChoiceId[], ResponseId];

// `CorrectAndIncorrectResponseMappings` has dependencies on `Parts` and `Choices` that the ids correspond to.
type TargetedFeedbackBase = HasChoices &
  HasParts & {
    authoring: {
      feedback: {
        type: 'TargetedFeedbackEnabled' | 'TargetedFeedbackDisabled';
        correct: ChoiceIdsToResponseId;
        incorrect: ChoiceIdsToResponseId;
        targeted: ChoiceIdsToResponseId[];
      };
    };
  };
export type TargetedFeedbackEnabled = {
  authoring: {
    feedback: {
      type: 'TargetedFeedbackEnabled';
    };
  };
} & TargetedFeedbackBase;
export type TargetedFeedbackDisabled = {
  authoring: {
    feedback: {
      type: 'TargetedFeedbackDisabled';
    };
  };
} & TargetedFeedbackBase;
export type HasTargetedFeedback = TargetedFeedbackEnabled | TargetedFeedbackDisabled;

export const isTargetedFeedbackEnabled = (
  model: HasTargetedFeedback,
): model is TargetedFeedbackEnabled => model.authoring.feedback.type === 'TargetedFeedbackEnabled';
