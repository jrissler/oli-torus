import { getResponse } from 'components/activities/common/authoring/utils';
import { RichText } from 'data/content/activities/activity';
import { HasParts } from 'data/content/activities/part';
import produce, { Draft } from 'immer';
import {
  HasTargetedFeedback,
  TargetedFeedbackDisabled,
  TargetedFeedbackEnabled,
} from '../../feedback/targeted/types';

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
