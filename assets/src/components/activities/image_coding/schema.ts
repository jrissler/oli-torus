import { ActivityModelSchema } from 'data/content/activities/activity';
import { IFeedback } from 'data/content/activities/feedback';
import { IPart } from 'data/content/activities/part';
import { IStem } from 'data/content/activities/stem';

export interface ImageCodingModelSchema extends ActivityModelSchema {
  stem: IStem;
  isExample: boolean;
  starterCode: string;
  solutionCode: string;
  resourceURLs: string[];
  // for evaluation:
  tolerance: number;
  regex: string;
  feedback: IFeedback[];
  authoring: {
    parts: IPart[];
    previewText: string;
  };
}

export interface ModelEditorProps {
  model: ImageCodingModelSchema;
  editMode: boolean;
}
