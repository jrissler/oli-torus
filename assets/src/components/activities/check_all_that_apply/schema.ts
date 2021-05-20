import {
  ActivityModelSchema,
  HasChoices,
  HasStem,
  HasPreviewText,
  HasTransformations,
  HasParts,
  HasTargetedFeedback,
} from '../types';

export type CheckAllThatApplyModelSchemaV2 = ActivityModelSchema &
  HasStem &
  HasChoices &
  HasPreviewText &
  HasTransformations &
  HasParts &
  HasTargetedFeedback;
