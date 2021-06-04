import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { Description } from 'components/misc/Description';
import { IconIncorrect } from 'components/misc/Icons';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  ChoiceId,
  ChoiceIdsToResponseId,
  HasParts,
  HasTargetedFeedback,
  ResponseId,
  RichText,
  Rule,
  TargetedFeedbackEnabled,
} from 'components/activities/types';
import {
  getResponse,
  getResponses,
  makeResponse,
} from 'components/activities/common/authoring/utils';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { ID } from 'data/content/model';
import produce, { Draft } from 'immer';
import { useFeedback } from './Feedback';

interface Option {
  id: string;
  label: string;
}
type OptionMap = { [id: string]: Option[] };

// Choices
export const getChoiceIds = ([choiceIds]: ChoiceIdsToResponseId) => choiceIds;
export const getCorrectChoiceIds = (model: HasTargetedFeedback) =>
  getChoiceIds(model.authoring.feedback.correct);
export const getIncorrectChoiceIds = (model: HasTargetedFeedback) =>
  getChoiceIds(model.authoring.feedback.incorrect);
export const getTargetedChoiceIds = (model: TargetedFeedbackEnabled) =>
  model.authoring.feedback.targeted.map(getChoiceIds);
export const isCorrectChoice = (model: HasTargetedFeedback, choiceId: ChoiceId) =>
  getCorrectChoiceIds(model).includes(choiceId);

// Responses
export const getResponseId = ([, responseId]: ChoiceIdsToResponseId) => responseId;
export const getCorrectResponse = (model: HasTargetedFeedback) =>
  getResponse(model, getResponseId(model.authoring.feedback.correct));
export const getIncorrectResponse = (model: HasTargetedFeedback) =>
  getResponse(model, getResponseId(model.authoring.feedback.incorrect));
export const getTargetedResponses = (model: TargetedFeedbackEnabled & HasParts) =>
  model.authoring.feedback.targeted.map((assoc) => getResponse(model, getResponseId(assoc)));

const updateCorrectResponseRule = (model: HasTargetedFeedback) =>
  (getCorrectResponse(model).rule = createRuleForIds(
    getCorrectChoiceIds(model),
    getIncorrectChoiceIds(model),
  ));

// Rules
export const createRuleForIds = (toMatch: ID[], notToMatch: ID[]) =>
  unionRules(
    toMatch.map(createMatchRule).concat(notToMatch.map((id) => invertRule(createMatchRule(id)))),
  );
export const createMatchRule = (id: string) => `input like {${id}}`;
export const invertRule = (rule: string) => `(!(${rule}))`;
export const unionTwoRules = (rule1: string, rule2: string) => `${rule2} && (${rule1})`;
export const unionRules = (rules: string[]) => rules.reduce(unionTwoRules);

// Other
export function setDifference<T>(subtractedFrom: T[], toSubtract: T[]): T[] {
  return subtractedFrom.filter((x) => !toSubtract.includes(x));
}

// addTargetedFeedback: () => {
//     return (model: CATA) => {
//       switch (model.type) {
//         case 'SimpleCATA':
//           return;
//         case 'TargetedCATA':
//           // eslint-disable-next-line
//           const response = makeResponse(
//             createRuleForIds(
//               [],
//               model.choices.map(({ id }) => id),
//             ),
//             0,
//             '',
//           );

//           getResponses(model).push(response);
//           model.authoring.targeted.push([[], response.id]);
//           return;
//       }
//     };
//   },

//   removeTargetedFeedback: (responseId: ResponseId) => {
//     return (model: CATA) => {
//       switch (model.type) {
//         case 'SimpleCATA':
//           return;
//         case 'TargetedCATA':
//           removeFromList(getResponse(model, responseId), getResponses(model));
//           removeFromList(
//             model.authoring.targeted.find((assoc) => getResponseId(assoc) === responseId),
//             model.authoring.targeted,
//           );
//       }
//     };
//   },

//   editTargetedFeedbackChoices: (responseId: ResponseId, choiceIds: ChoiceId[]) => {
//     return (model: CATA) => {
//       switch (model.type) {
//         case 'SimpleCATA':
//           break;
//         case 'TargetedCATA':
//           // eslint-disable-next-line
//           const assoc = model.authoring.targeted.find(
//             (assoc) => getResponseId(assoc) === responseId,
//           );
//           if (!assoc) break;
//           assoc[0] = choiceIds;
//           break;
//       }
//       updateResponseRules(model);
//     };
//   },

// Update all response rules from new choices that are not yet reflected by the rules.
const syncResponseRules = (model: HasTargetedFeedback) => {
  // Always update the rule to match the correct response with the correct answer choices.
  updateCorrectResponseRule(model);

  // The targeted rules list might be empty, or it might not.
  const targetedFeedbackRules: Rule[] = [];
  const allChoiceIds = model.choices.map((choice) => choice.id);
  model.authoring.feedback.targeted.forEach((assoc) => {
    const targetedRule = createRuleForIds(
      getChoiceIds(assoc),
      setDifference(allChoiceIds, getChoiceIds(assoc)),
    );
    targetedFeedbackRules.push(targetedRule);
    getResponse(model, getResponseId(assoc)).rule = targetedRule;
  });

  // Now for the catch-all incorrect response rule, which matches any choice combination that doesn't match either the correct response rule or any of the targeted feedback rules.
  getIncorrectResponse(model).rule = unionRules(
    targetedFeedbackRules.map(invertRule).concat([invertRule(getCorrectResponse(model).rule)]),
  );
};

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

const useTargetedFeedback = () => {
  const { editMode, model, dispatch } = useAuthoringElementContext<HasTargetedFeedback>();
  const { setResponseFeedback } = useFeedback();

  const addTargetedFeedback = () =>
    produce((model: Draft<HasTargetedFeedback>) => {
      const response = makeResponse(
        createRuleForIds(
          [],
          model.choices.map(({ id }) => id),
        ),
        0,
        '',
      );

      getResponses(model).push(response);
      model.authoring.feedback.targeted.push([[], response.id]);
    });

  const removeTargetedFeedback = (responseId: ResponseId) =>
    produce((model: Draft<HasTargetedFeedback>) => {
      removeFromList(getResponse(model, responseId), getResponses(model));
      removeFromList(
        model.authoring.feedback.targeted.find((assoc) => getResponseId(assoc) === responseId),
        model.authoring.feedback.targeted,
      );
    });

  const editTargetedFeedbackChoices = (responseId: ResponseId, choiceIds: ChoiceId[]) =>
    produce((model: Draft<HasTargetedFeedback>) => {
      const assoc = model.authoring.feedback.targeted.find(
        (assoc) => getResponseId(assoc) === responseId,
      );
      if (!assoc) return;
      assoc[0] = choiceIds;

      syncResponseRules(model);
    });

  return {
    model,
    editMode,
    setResponseFeedback,
    addTargetedFeedback,
    removeTargetedFeedback,
    editTargetedFeedbackChoices,
    dispatch,
  };
};

interface Props {
  onEditFeedback?: (id: string, content: RichText) => void;
  onAddTargetedFeedback?: () => void;
  onRemoveTargetedFeedback?: (responseId: ResponseId) => void;
  onEditTargetedFeedbackChoices?: (responseId: ResponseId, choiceIds: ChoiceId[]) => void;
}
export const TargetedFeedback: React.FC<Props> = ({
  onEditFeedback,
  onAddTargetedFeedback,
  onRemoveTargetedFeedback,
  onEditTargetedFeedbackChoices,
  children,
}) => {
  const {
    model,
    editMode,
    setResponseFeedback,
    addTargetedFeedback,
    removeTargetedFeedback,
    editTargetedFeedbackChoices,
    dispatch,
  } = useTargetedFeedback();

  const createSelection = (assocs: ChoiceIdsToResponseId[]) =>
    assocs.reduce((acc, assoc) => {
      acc[getResponseId(assoc)] = toOptions(getChoiceIds(assoc));
      return acc;
    }, {} as OptionMap);

  const toOptions = (choiceIds: ChoiceId[]) =>
    choiceIds.map((id) => ({
      id,
      label: (model.choices.findIndex((choice) => choice.id === id) + 1).toString(),
    }));

  const allChoiceOptions = toOptions(model.choices.map((choice) => choice.id));
  const selected = createSelection(model.authoring.feedback.targeted);

  return (
    <>
      {children}

      {model.authoring.feedback.targeted.map((assoc) => {
        const response = getResponse(model, getResponseId(assoc));
        return (
          <div className="mb-3" key={response.id}>
            <Description>
              <IconIncorrect /> Feedback for Incorrect Combination
              <Typeahead
                id={response.id}
                disabled={!editMode}
                placeholder="Select choices..."
                options={allChoiceOptions}
                selected={selected[response.id]}
                selectHintOnEnter
                multiple
                onChange={(selection) =>
                  onEditTargetedFeedbackChoices
                    ? onEditTargetedFeedbackChoices(
                        response.id,
                        selection.map((s) => s.id),
                      )
                    : dispatch(
                        editTargetedFeedbackChoices(
                          response.id,
                          selection.map((s) => s.id),
                        ),
                      )
                }
              />
            </Description>
            <div className="d-flex align-items-center" style={{ flex: 1 }}>
              <RichTextEditor
                className="flex-fill"
                text={response.feedback.content}
                onEdit={(content) =>
                  onEditFeedback
                    ? onEditFeedback(response.id, content)
                    : setResponseFeedback(response.id, content)
                }
              />
              <RemoveButton
                onClick={() =>
                  onRemoveTargetedFeedback
                    ? onRemoveTargetedFeedback(response.id)
                    : removeTargetedFeedback(response.id)
                }
              />
            </div>
          </div>
        );
      })}
      <AuthoringButton
        className="btn btn-sm btn-primary my-2"
        onClick={onAddTargetedFeedback ? onAddTargetedFeedback : addTargetedFeedback}
      >
        Add targeted feedback
      </AuthoringButton>
    </>
  );
};
