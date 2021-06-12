import { IPart } from '../common/authoring/parts/types';
import { ITransformation } from '../common/authoring/transformations/types';
import { HasChoices } from '../common/choices/types';
import { HasStem } from '../common/stem/types';
import { ActivityModelSchema, ChoiceId, ResponseId } from '../types';

export type CheckAllThatApplyModelSchema = SimpleCATA | TargetedCATA;

interface BaseCATA extends ActivityModelSchema, HasStem, HasChoices {
  authoring: {
    // An association list of correct choice ids to the matching response id
    correct: ChoiceIdsToResponseId;
    // An association list of incorrect choice ids to the matching response id
    incorrect: ChoiceIdsToResponseId;
    parts: IPart[];
    transformations: ITransformation[];
    previewText: string;
  };
}

export type ChoiceIdsToResponseId = [ChoiceId[], ResponseId];

export type SimpleCATA = BaseCATA & {
  type: 'SimpleCATA';
};

export type TargetedCATA = BaseCATA & {
  type: 'TargetedCATA';
  authoring: {
    // An association list of choice ids to the matching targeted response id
    targeted: ChoiceIdsToResponseId[];
  };
};

export interface ModelEditorProps {
  model: CheckAllThatApplyModelSchema;
  editMode: boolean;
}
