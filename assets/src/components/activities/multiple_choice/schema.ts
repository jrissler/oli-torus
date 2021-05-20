import {
  ActivityModelSchema,
  HasStem,
  HasChoices,
  HasParts,
  HasTransformations,
  HasPreviewText,
} from '../types';

export type MultipleChoiceModelSchema = ActivityModelSchema &
  HasStem &
  HasChoices &
  HasParts &
  HasTransformations &
  HasPreviewText;
