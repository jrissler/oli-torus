import { OrderingModelSchema as Ordering } from './schema';
import {
  createRuleForIds,
  getCorrectResponse,
  getCorrectOrdering,
  getIncorrectResponse,
  invertRule,
  unionRules,
  isSimpleOrdering,
  getChoiceIds,
  getResponseId,
} from './utils';
import { ChoiceId, ResponseId } from '../types';
import {
  getResponse,
  getResponses,
  makeChoice,
  makeResponse,
} from 'components/activities/common/authoring/utils';
import {
  addHint,
  editChoice,
  editFeedback,
  editHint,
  editStem,
  moveChoice,
  removeHint,
} from 'components/activities/common/authoring/immerActions';

export class Actions {
  static toggleType() {
    return (model: Ordering) => {
      if (isSimpleOrdering(model)) {
        (model as any).type = 'TargetedOrdering';
        (model as any).authoring.targeted = [];
        return;
      }

      (model as any).type = 'SimpleOrdering';
      delete (model as any).authoring.targeted;
    };
  }

  static editStem = editStem;

  static addChoice() {
    return (model: Ordering) => {
      const newChoice = makeChoice('');

      model.choices.push(newChoice);
      getChoiceIds(model.authoring.correct).push(newChoice.id);
      updateResponseRules(model);
    };
  }

  static editChoice = editChoice;

  static removeChoice(id: ChoiceId) {
    return (model: Ordering) => {
      const removeIdFrom = (list: ChoiceId[]) => removeFromList(id, list);
      model.choices = model.choices.filter((choice) => choice.id !== id);
      removeIdFrom(getChoiceIds(model.authoring.correct));

      switch (model.type) {
        case 'SimpleOrdering':
          break;
        case 'TargetedOrdering':
          model.authoring.targeted.forEach((assoc) => {
            removeIdFrom(getChoiceIds(assoc));
            // remove targeted feedback choice ids if they match the correct answer
            if (
              getChoiceIds(assoc).every(
                (id1, index) => getCorrectOrdering(model).findIndex((id2) => id1 === id2) === index,
              )
            ) {
              assoc[0] = [];
            }
          });
          break;
      }

      updateResponseRules(model);
    };
  }

  static moveChoice = moveChoice;
  static editFeedback = editFeedback;

  static addTargetedFeedback() {
    return (model: Ordering) => {
      switch (model.type) {
        case 'SimpleOrdering':
          return;
        case 'TargetedOrdering':
          // eslint-disable-next-line
          const newResponse = makeResponse(createRuleForIds([]), 0, '');

          getResponses(model).push(newResponse);
          model.authoring.targeted.push([[], newResponse.id]);
          return;
      }
    };
  }

  static removeTargetedFeedback(responseId: ResponseId) {
    return (model: Ordering) => {
      switch (model.type) {
        case 'SimpleOrdering':
          return;
        case 'TargetedOrdering':
          removeFromList(getResponse(model, responseId), getResponses(model));
          removeFromList(
            model.authoring.targeted.find((assoc) => getResponseId(assoc) === responseId),
            model.authoring.targeted,
          );
      }
    };
  }

  static editTargetedFeedbackChoices(responseId: ResponseId, choiceIds: ChoiceId[]) {
    return (model: Ordering) => {
      switch (model.type) {
        case 'SimpleOrdering':
          break;
        case 'TargetedOrdering':
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
const updateResponseRules = (model: Ordering) => {
  getCorrectResponse(model).rule = createRuleForIds(getCorrectOrdering(model));

  switch (model.type) {
    case 'SimpleOrdering':
      getIncorrectResponse(model).rule = invertRule(getCorrectResponse(model).rule);
      return;
    case 'TargetedOrdering':
      // eslint-disable-next-line
      const targetedRules: string[] = [];
      model.authoring.targeted.forEach((assoc) => {
        const targetedRule = createRuleForIds(getChoiceIds(assoc));
        targetedRules.push(targetedRule);
        getResponse(model, getResponseId(assoc)).rule = targetedRule;
      });
      getIncorrectResponse(model).rule = unionRules(
        targetedRules.map(invertRule).concat([invertRule(getCorrectResponse(model).rule)]),
      );
      return;
  }
};
