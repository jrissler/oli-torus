import { IPart } from '../common/authoring/parts/types';
import { ITransformation } from '../common/authoring/transformations/types';
import { IStem } from '../common/stem/types';
import { ActivityModelSchema } from '../types';

export type InputType = 'text' | 'numeric' | 'textarea';

export interface ShortAnswerModelSchema extends ActivityModelSchema {
  stem: IStem;
  inputType: InputType;
  authoring: {
    parts: IPart[];
    transformations: ITransformation[];
    previewText: string;
  };
}

export interface ModelEditorProps {
  model: ShortAnswerModelSchema;
  editMode: boolean;
}
