
import { IPart } from '../common/authoring/parts/types';
import { IFeedback } from '../common/feedback/types';
import { IStem } from '../common/stem/types';
import { ActivityModelSchema } from '../types';

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
