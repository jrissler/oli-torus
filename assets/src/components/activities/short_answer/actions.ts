import { ShortAnswerModelSchema, InputType } from './schema';
import { getResponse, makeResponse } from 'components/activities/common/authoring/utils';
import { editStem } from '../common/authoring/actions/stem';
import {addHint, editHint, removeHint} from '../common/authoring/actions/hints'
import {editFeedback} from '../common/authoring/actions/feedback'

export class ShortAnswerActions {
  static setModel(model: ShortAnswerModelSchema) {
    return (draftState: ShortAnswerModelSchema) => {
      draftState.authoring = model.authoring;
      draftState.inputType = model.inputType;
      draftState.stem = model.stem;
    };
  }

  static editStem = editStem;
  static editFeedback = editFeedback;

  static editRule(id: string, rule: string) {
    return (model: ShortAnswerModelSchema) => (getResponse(model, id).rule = rule);
  }

  static addResponse() {
    return (draftState: ShortAnswerModelSchema) => {
      let rule;
      if (draftState.inputType === 'numeric') {
        rule = 'input = {1}';
      } else {
        rule = 'input like {another answer}';
      }

      // Insert a new reponse just before the last response
      const index = draftState.authoring.parts[0].responses.length - 1;
      draftState.authoring.parts[0].responses.splice(index, 0, makeResponse(rule, 0, ''));
    };
  }

  static removeReponse(id: string) {
    return (draftState: ShortAnswerModelSchema) => {
      draftState.authoring.parts[0].responses = draftState.authoring.parts[0].responses.filter(
        (r) => r.id !== id,
      );
    };
  }

  static addHint = addHint;
  static editHint = editHint;
  static removeHint = removeHint;

  static setInputType(inputType: InputType) {
    return (draftState: ShortAnswerModelSchema) => {
      // When we transition from numeric to text(area) or back, we reset the responses
      if (draftState.inputType === 'numeric' && inputType !== 'numeric') {
        draftState.authoring.parts[0].responses = [
          makeResponse('input like {answer}', 1, ''),
          makeResponse('input like {.*}', 0, ''),
        ];
      } else if (draftState.inputType !== 'numeric' && inputType === 'numeric') {
        draftState.authoring.parts[0].responses = [
          makeResponse('input = {1}', 1, ''),
          makeResponse('input like {.*}', 0, ''),
        ];
      }

      draftState.inputType = inputType;
    };
  }
}
