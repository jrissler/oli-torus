import { getResponse } from 'components/activities/common/authoring/utils';
import {
  HasParts,
  HasTargetedFeedback,
  isTargetedFeedbackEnabled,
  RichText,
  TargetedFeedbackDisabled,
  TargetedFeedbackEnabled,
} from 'components/activities/types';
import produce, { Draft } from 'immer';

export const toggleTargetedFeedback = () =>
  produce((draft: Draft<HasTargetedFeedback>) => {
    if (draft.authoring.feedback.type === 'TargetedFeedbackEnabled') {
      (draft as TargetedFeedbackDisabled).authoring.feedback.type = 'TargetedFeedbackDisabled';
    } else {
      (draft as TargetedFeedbackEnabled).authoring.feedback.type = 'TargetedFeedbackEnabled';
    }
  });

export const editFeedback = (id: string, content: RichText) => {
  return (model: HasParts) => {
    getResponse(model, id).feedback.content = content;
  };
};
