import { ActivityModelSchema } from 'data/content/activities/activity';
import { IPart } from 'data/content/activities/part';
import { IStem } from 'data/content/activities/stem';
import { ITransformation } from 'data/content/activities/transformation';

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
