import { CheckAllThatApplyModelSchema as CATA } from './schema';
import {
  createRuleForIds,
  getCorrectResponse,
  getChoiceIds,
  getCorrectChoiceIds,
  getIncorrectChoiceIds,
  getIncorrectResponse,
  getResponseId,
  setDifference,
  invertRule,
  unionRules,
} from './utils';
import {
  RichText,
  Hint as HintType,
  ChoiceId,
  Choice,
  ResponseId,
  Operation,
  HasTargetedFeedback,
  HasParts,
  HasChoices,
} from '../types';
import { toSimpleText } from 'data/content/text';
import {
  addHint,
  editChoice,
  editFeedback,
  editHint,
  editStem,
  moveChoice,
  removeHint,
  toggleAnswerChoiceShuffling,
} from 'components/activities/common/authoring/immerActions';
import {
  getResponse,
  getResponses,
  isShuffled,
  isTargetedFeedbackEnabled,
  makeChoice,
  makeResponse,
  transformation,
} from 'components/activities/common/authoring/utils';

export class Actions {
  static editStem = editStem;

  static addChoice() {
    return (model: CATA) => {
      const newChoice = makeChoice('');

      model.choices.push(newChoice);
      getChoiceIds(model.authoring.incorrect).push(newChoice.id);
      updateResponseRules(model);
    };
  }

  static editChoiceContent = editChoice;

  static removeChoice(id: string) {
    return (model: CATA) => {
      const removeIdFrom = (list: string[]) => removeFromList(id, list);
      model.choices = model.choices.filter((choice) => choice.id !== id);
      removeIdFrom(getChoiceIds(model.authoring.correct));
      removeIdFrom(getChoiceIds(model.authoring.incorrect));

      if (model.authoring.targetedFeedback !== undefined) {
        model.authoring.targetedFeedback.forEach((assoc) => removeIdFrom(getChoiceIds(assoc)));
      }

      updateResponseRules(model);
    };
  }

  static toggleChoiceCorrectness(choiceId: ChoiceId) {
    return (model: CATA) => {
      addOrRemoveFromList(choiceId, getChoiceIds(model.authoring.correct));
      addOrRemoveFromList(choiceId, getChoiceIds(model.authoring.incorrect));
      updateResponseRules(model);
    };
  }

  static editResponseFeedback = editFeedback;

  static addTargetedFeedback() {
    return (model: { authoring: HasTargetedFeedback & HasParts } & HasChoices) => {
      if (model.authoring.targetedFeedback !== undefined) {
        const response = makeResponse(
          createRuleForIds(
            [],
            model.choices.map(({ id }) => id),
          ),
          0,
          '',
        );

        getResponses(model).push(response);
        model.authoring.targetedFeedback.push([[], response.id]);
      }
    };
  }

  static removeTargetedFeedback(responseId: ResponseId) {
    return (model: CATA) => {
      if (model.authoring.targetedFeedback === undefined) {
        return;
      }
      removeFromList(getResponse(model, responseId), getResponses(model));
      removeFromList(
        model.authoring.targetedFeedback.find((assoc) => getResponseId(assoc) === responseId),
        model.authoring.targetedFeedback,
      );
    };
  }

  static editTargetedFeedbackChoices(responseId: ResponseId, choiceIds: ChoiceId[]) {
    return (model: CATA) => {
      if (model.authoring.targetedFeedback !== undefined) {
        const assoc = model.authoring.targetedFeedback.find(
          (assoc) => getResponseId(assoc) === responseId,
        );
        if (assoc) {
          assoc[0] = choiceIds;
        }
      }
      updateResponseRules(model);
    };
  }

  static addHint = addHint;

  static editHint = editHint;

  static removeHint = removeHint;
  static toggleAnswerChoiceShuffling = toggleAnswerChoiceShuffling;
}

// mutable
function addOrRemoveFromList<T>(item: T, list: T[]) {
  if (list.find((x) => x === item)) {
    return removeFromList(item, list);
  }
  return list.push(item);
}
// mutable
function removeFromList<T>(item: T, list: T[]) {
  const index = list.findIndex((x) => x === item);
  if (index > -1) {
    list.splice(index, 1);
  }
}

// Update all response rules based on a model with new choices that
// are not yet reflected by the rules.
const updateResponseRules = (model: CATA) => {
  getCorrectResponse(model).rule = createRuleForIds(
    getCorrectChoiceIds(model),
    getIncorrectChoiceIds(model),
  );

  if (model.authoring.targetedFeedback === undefined) {
    getIncorrectResponse(model).rule = invertRule(getCorrectResponse(model).rule);
  } else {
    const targetedRules: string[] = [];
    const allChoiceIds = model.choices.map((choice) => choice.id);
    model.authoring.targetedFeedback.forEach((assoc) => {
      const targetedRule = createRuleForIds(
        getChoiceIds(assoc),
        setDifference(allChoiceIds, getChoiceIds(assoc)),
      );
      targetedRules.push(targetedRule);
      getResponse(model, getResponseId(assoc)).rule = targetedRule;
    });
    getIncorrectResponse(model).rule = unionRules(
      targetedRules.map(invertRule).concat([invertRule(getCorrectResponse(model).rule)]),
    );
  }
};
