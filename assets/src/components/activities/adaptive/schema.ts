import { ActivityModelSchema, PartComponentDefinition } from 'data/content/activities/activity';
import { IPart } from 'data/content/activities/part';
import { ITransformation } from 'data/content/activities/transformation';

export interface AdaptiveModelSchema extends ActivityModelSchema {
  // eslint-disable-next-line
  content: {
    custom?: Record<string, any>;
    partsLayout?: PartComponentDefinition[];
  };
  authoring: {
    parts: IPart[];
    transformations: ITransformation[];
    previewText: string;
  };
}

export interface ModelEditorProps {
  model: AdaptiveModelSchema;
  editMode: boolean;
}
