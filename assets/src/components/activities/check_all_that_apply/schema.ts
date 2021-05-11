import {
  Part,
  Transformation,
  ActivityModelSchema,
  Stem,

  ChoiceIdsToResponseId,
  HasChoices,
  HasStem,
} from '../types';

export interface CheckAllThatApplyModelSchema extends ActivityModelSchema, HasStem, HasChoices {
  authoring: {
    // An association list of correct choice ids to the matching response id
    correct: ChoiceIdsToResponseId;
    // An association list of incorrect choice ids to the matching response id
    incorrect: ChoiceIdsToResponseId;
    parts: Part[];
    transformations: Transformation[];
    previewText: string;
  };
}
