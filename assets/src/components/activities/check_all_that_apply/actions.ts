import { CheckAllThatApplyModelSchema as CATA } from './schema';
import {
  getCorrectResponse,
  getChoiceIds,
  getCorrectChoiceIds,
  getIncorrectChoiceIds,
  getIncorrectResponse,
  getResponseId,
  isSimpleCATA,
} from './utils';
import { ChoiceId, Choice, ResponseId, makeResponse } from '../types';
import { ChoiceActions } from 'components/activities/common/choices/authoring/choiceActions';
import { addOrRemove, remove, setDifference } from 'components/activities/common/utils';
import {
  createRuleForIds,
  getResponse,
  getResponses,
  invertRule,
  unionRules,
} from 'components/activities/common/responses/authoring/responseUtils';

export class CATAActions {
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

  static addChoice(choice: Choice) {
    return (model: CATA) => {
      ChoiceActions.addChoice(choice);

      getChoiceIds(model.authoring.incorrect).push(choice.id);
      updateResponseRules(model);
    };
  }

  static removeChoice(id: string) {
    return (model: CATA) => {
      ChoiceActions.removeChoice(id);

      remove(id, getChoiceIds(model.authoring.correct));
      remove(id, getChoiceIds(model.authoring.incorrect));

      if (model.type === 'TargetedCATA') {
        model.authoring.targeted.forEach((assoc) => remove(id, getChoiceIds(assoc)));
      }

      updateResponseRules(model);
    };
  }

  static toggleChoiceCorrectness(choiceId: ChoiceId) {
    return (model: CATA) => {
      addOrRemove(choiceId, getChoiceIds(model.authoring.correct));
      addOrRemove(choiceId, getChoiceIds(model.authoring.incorrect));
      updateResponseRules(model);
    };
  }

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
          remove(getResponse(model, responseId), getResponses(model));
          remove(
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
