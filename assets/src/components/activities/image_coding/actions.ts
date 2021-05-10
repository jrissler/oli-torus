import { ImageCodingModelSchema } from './schema';
import {
  addHint,
  editHint,
  editStem,
  removeHint,
} from 'components/activities/common/authoring/immerActions';
import { RichText } from 'components/activities/types';

export class ICActions {
  static editStem = editStem;

  static editStarterCode(text: string) {
    return (draftState: ImageCodingModelSchema) => {
      draftState.starterCode = text;
    };
  }

  static editSolutionCode(text: string) {
    return (draftState: ImageCodingModelSchema) => {
      draftState.solutionCode = text;
    };
  }

  static editIsExample(value: boolean) {
    return (draftState: ImageCodingModelSchema) => {
      draftState.isExample = value;
    };
  }

  static addResourceURL(value: string) {
    return (draftState: ImageCodingModelSchema) => {
      if (draftState.resourceURLs.indexOf(value) === -1) {
        draftState.resourceURLs.push(value);
      }
    };
  }

  static removeResourceURL(value: string) {
    return (draftState: ImageCodingModelSchema) => {
      draftState.resourceURLs = draftState.resourceURLs.filter((url) => url !== value);
    };
  }

  static editTolerance(value: number) {
    return (draftState: ImageCodingModelSchema) => {
      draftState.tolerance = value;
    };
  }

  static editRegex(value: string) {
    return (draftState: ImageCodingModelSchema) => {
      draftState.regex = value;
    };
  }

  static editFeedback(score: number, content: RichText) {
    return (draftState: ImageCodingModelSchema) => {
      draftState.feedback[score].content = content;
    };
  }

  static addHint = addHint;
  static editHint = editHint;
  static removeHint = removeHint;
}
