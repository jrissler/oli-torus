import {
  addHint,
  editChoice,
  editFeedback,
  editHint,
  editStem,
  removeChoice,
  removeHint,
  toggleAnswerChoiceShuffling,
} from 'components/activities/common/authoring/immerActions';
import { makeChoice, makeResponse } from 'components/activities/common/authoring/utils';
import { HasChoices, HasParts } from 'components/activities/types';

export class MCActions {
  static editStem = editStem;
  static addChoice = () => {
    return (model: HasChoices & HasParts) => {
      const choice = makeChoice('');
      model.choices.push(choice);
      model.authoring.parts[0].responses.push(makeResponse(`input like {${choice.id}}`, 0, ''));
    };
  };
  static editChoice = editChoice;
  static removeChoice = removeChoice((r, choiceId) => r.rule !== `input like {${choiceId}}`);
  static editFeedback = editFeedback;
  static addHint = addHint;
  static editHint = editHint;
  static removeHint = removeHint;
  static toggleAnswerChoiceShuffling = toggleAnswerChoiceShuffling;
}
