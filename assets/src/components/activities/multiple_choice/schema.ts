import { HasParts } from '../common/authoring/parts/types';
import { HasPreviewText } from '../common/authoring/preview_text/types';
import { HasTransformations } from '../common/authoring/transformations/types';
import { HasChoices } from '../common/choices/types';
import { HasStem } from '../common/stem/types';
import { ActivityModelSchema } from '../types';

export type MultipleChoiceModelSchema = ActivityModelSchema &
  HasStem &
  HasChoices &
  HasParts &
  HasTransformations &
  HasPreviewText;
