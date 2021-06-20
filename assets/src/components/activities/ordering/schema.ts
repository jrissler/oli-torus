import { ActivityModelSchema, ChoiceId, ResponseId } from 'data/content/activities/activity';
import { IChoice } from 'data/content/activities/choice';
import { IPart } from 'data/content/activities/part';
import { IStem } from 'data/content/activities/stem';
import { ITransformation } from 'data/content/activities/transformation';
import { ResponseMappings } from '../common/authoring/responseChoices/responseChoicesSlice';

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

export interface OrderingSchema extends ActivityModelSchema {
  stem: IStem;
  choices: IChoice[];
  authoring: {
    previewText: string;
    transformations: ITransformation[];
    parts: IPart[];
    // Responses don't have a tie to the choices that trigger them,
    // so we make a relationship table to keep track of the mappings
    responseMappings: ResponseMappings[];
  };
}
