import { CheckAllThatApplyModelSchema as CATA, TargetedCATA } from './schema';
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
  isSimpleCATA,
} from './utils';
import { RichText, Hint as HintType, ChoiceId, Choice, ResponseId } from '../types';
import { toSimpleText } from 'data/content/text';
import {
  getChoice,
  getHint,
  getHints,
  getResponse,
  getResponses,
  makeChoice,
  makeHint,
  makeResponse,
  moveChoice,
} from 'components/activities/common/authoring/utils';
import {
  addHint,
  editFeedback,
  editHint,
  editStem,
  removeHint,
  toggleAnswerChoiceShuffling,
} from 'components/activities/common/authoring/immerActions';

export class Actions {
  static toggleType() {
    return (model: CATA) => {
      if (isSimpleCATA(model)) {
        (model as any).type = 'TargetedCATA';
        (model as any).authoring.targeted = [];
        return;
      }

      (model as any).type = 'SimpleCATA';
      delete (model as any).authoring.targeted;
    };
  }

  static editStem = editStem;

  static addChoice() {
    return (model: CATA) => {
      const newChoice = makeChoice('');

      model.choices.push(newChoice);
      getChoiceIds(model.authoring.incorrect).push(newChoice.id);
      updateResponseRules(model);
    };
  }

  static editChoiceContent(id: string, content: RichText) {
    return (model: CATA) => {
      getChoice(model, id).content = content;
    };
  }

  static removeChoice(id: string) {
    return (model: CATA) => {
      const removeIdFrom = (list: string[]) => removeFromList(id, list);
      model.choices = model.choices.filter((choice) => choice.id !== id);
      removeIdFrom(getChoiceIds(model.authoring.correct));
      removeIdFrom(getChoiceIds(model.authoring.incorrect));

      switch (model.type) {
        case 'SimpleCATA':
          break;
        case 'TargetedCATA':
          model.authoring.targeted.forEach((assoc) => removeIdFrom(getChoiceIds(assoc)));
      }

      updateResponseRules(model);
    };
  }

  static toggleChoiceCorrectness(choiceId: ChoiceId) {
    return (model: CATA) => {
      const addOrRemoveId = (list: string[]) => addOrRemoveFromList(choiceId, list);
      addOrRemoveId(getChoiceIds(model.authoring.correct));
      addOrRemoveId(getChoiceIds(model.authoring.incorrect));
      updateResponseRules(model);
    };
  }

  static editFeedback = editFeedback;
  static moveChoice = moveChoice;

  static addTargetedFeedback() {
    return (model: CATA) => {
      switch (model.type) {
        case 'SimpleCATA':
          return;
        case 'TargetedCATA':
          // eslint-disable-next-line
          const response = makeResponse(
            createRuleForIds(
              [],
              model.choices.map(({ id }) => id),
            ),
            0,
            '',
          );

          getResponses(model).push(response);
          model.authoring.targeted.push([[], response.id]);
          return;
      }
    };
  }

  static removeTargetedFeedback(responseId: ResponseId) {
    return (model: CATA) => {
      switch (model.type) {
        case 'SimpleCATA':
          return;
        case 'TargetedCATA':
          removeFromList(getResponse(model, responseId), getResponses(model));
          removeFromList(
            model.authoring.targeted.find((assoc) => getResponseId(assoc) === responseId),
            model.authoring.targeted,
          );
      }
    };
  }

  static editTargetedFeedbackChoices(responseId: ResponseId, choiceIds: ChoiceId[]) {
    return (model: CATA) => {
      switch (model.type) {
        case 'SimpleCATA':
          break;
        case 'TargetedCATA':
          // eslint-disable-next-line
          const assoc = model.authoring.targeted.find(
            (assoc) => getResponseId(assoc) === responseId,
          );
          if (!assoc) break;
          assoc[0] = choiceIds;
          break;
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

  switch (model.type) {
    case 'SimpleCATA':
      getIncorrectResponse(model).rule = invertRule(getCorrectResponse(model).rule);
      break;
    case 'TargetedCATA':
      // eslint-disable-next-line
      const targetedRules: string[] = [];
      // eslint-disable-next-line
      const allChoiceIds = model.choices.map((choice) => choice.id);
      model.authoring.targeted.forEach((assoc) => {
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
      break;
  }
};
