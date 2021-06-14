import { IPart } from '../common/authoring/parts/types';
import { ITransformation } from '../common/authoring/transformations/types';
import { ActivityModelSchema, PartComponentDefinition } from '../types';

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
