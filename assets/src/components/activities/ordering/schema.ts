import { IPart } from '../common/authoring/parts/types';
import { ITransformation } from '../common/authoring/transformations/types';
import { IChoice } from '../common/choices/types';
import { IStem } from '../common/stem/types';
import { ActivityModelSchema, ChoiceId, ResponseId } from '../types';

export type OrderingModelSchema = SimpleOrdering | TargetedOrdering;

export type ChoiceIdsToResponseId = [ChoiceId[], ResponseId];

interface BaseOrdering extends ActivityModelSchema {
  stem: IStem;
  choices: IChoice[];
  authoring: {
    // An association list of the choice ids in the correct order to the matching response id
    correct: ChoiceIdsToResponseId;
    parts: IPart[];
    transformations: ITransformation[];
    previewText: string;
  };
}

export type SimpleOrdering = BaseOrdering & {
  type: 'SimpleOrdering';
};

export type TargetedOrdering = BaseOrdering & {
  type: 'TargetedOrdering';
  authoring: {
    // An association list of choice id orderings to matching targeted response ids
    targeted: ChoiceIdsToResponseId[];
  };
};

export interface ModelEditorProps {
  model: OrderingModelSchema;
  editMode: boolean;
}
