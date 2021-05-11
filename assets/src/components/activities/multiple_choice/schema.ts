import { ActivityModelSchema, HasStem, HasChoices, HasParts, HasTransformations } from '../types';

interface Authoring extends HasParts, HasTransformations {
  previewText: string;
}
export interface MultipleChoiceModelSchema extends ActivityModelSchema, HasStem, HasChoices {
  authoring: Authoring;
}
