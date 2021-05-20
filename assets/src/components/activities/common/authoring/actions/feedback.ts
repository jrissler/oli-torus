import { getResponse } from 'components/activities/common/authoring/utils';
import {
  HasParts,
  HasTargetedFeedback,
  isTargetedFeedbackEnabled,
  RichText,
} from 'components/activities/types';

export const toggleTargetedFeedback = () => {
  return (model: HasTargetedFeedback) => {
    if (isTargetedFeedbackEnabled(model)) {
      (model as HasTargetedFeedback).authoring.targeted = undefined;
      return;
    }
    model.authoring.targeted = [];
  };
};

export const editFeedback = (id: string, content: RichText) => {
  return (model: HasParts) => {
    getResponse(model, id).feedback.content = content;
  };
};
