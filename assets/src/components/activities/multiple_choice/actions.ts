import {
  addChoice,
  addHint,
  editChoice,
  editFeedback,
  editHint,
  editStem,
  removeChoice,
  removeHint,
  toggleAnswerChoiceShuffling,
} from 'components/activities/common/authoring/immerActions';
import { makeResponse } from 'components/activities/common/authoring/utils';

export class MCActions {
  static editStem = editStem;
  static addChoice = addChoice((choice) => makeResponse(`input like {${choice.id}}`, 0, ''));
  static editChoice = editChoice;
  static removeChoice = removeChoice((r, choiceId) => r.rule !== `input like {${choiceId}}`);
  static editFeedback = editFeedback;
  static addHint = addHint;
  static editHint = editHint;
  static removeHint = removeHint;
  static toggleAnswerChoiceShuffling = toggleAnswerChoiceShuffling;
}
