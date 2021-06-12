// const updateCorrectResponseRule = (
//   model: HasTargetedFeedback,
//   {
//     correctChoiceIds,
//     incorrectChoiceIds,
//   }: { correctChoiceIds: ChoiceId[]; incorrectChoiceIds: ChoiceId[] },
// ) => (getCorrectResponse(model).rule = createRuleForIds(correctChoiceIds, incorrectChoiceIds));

// const getTargetedFeedbackRules = (
//   model: HasTargetedFeedback,
// ): { responseId: ResponseId; rule: Rule }[] => {
//   return model.authoring.feedback.targeted.map((assoc) => ({
//     responseId: getResponseId(assoc),
//     rule: createRuleForIds(
//       getChoiceIds(assoc),
//       setDifference(
//         model.choices.map((choice) => choice.id),
//         getChoiceIds(assoc),
//       ),
//     ),
//   }));
// };

// const updateTargetedFeedbackRules = (
//   model: HasTargetedFeedback,
//   targetedFeedbackRules: { responseId: ResponseId; rule: Rule }[],
// ) => {
//   targetedFeedbackRules.forEach(({ responseId, rule }) => {
//     getResponse(model, responseId).rule = rule;
//   });
// };

// const updateIncorrectCatchallRules = (
//   model: HasTargetedFeedback,
//   targetedFeedbackRules: { responseId: ResponseId; rule: Rule }[],
// ) => {
//   getIncorrectResponse(model).rule = unionRules(
//     targetedFeedbackRules
//       .map(({ rule }) => invertRule(rule))
//       .concat([invertRule(getCorrectResponse(model).rule)]),
//   );
// };

// export const targetedFeedbackSlice = createSlice({
//   name: 'targetedFeedback',
//   initialState: {} as HasTargetedFeedback,
//   reducers: {
//     syncResponseRules(
//       state,
//       action: PayloadAction<{ correctChoiceIds: ChoiceId[]; incorrectChoiceIds: ChoiceId[] }>,
//     ) {
//       // Always update the rule to match the correct response with the correct answer choices.
//       updateCorrectResponseRule(state, action.payload);

//       // The targeted rules list might be empty, or it might not.
//       const targetedFeedbackRules = getTargetedFeedbackRules(state);
//       updateTargetedFeedbackRules(state, targetedFeedbackRules);

//       // Now for the catch-all incorrect response rule, which matches any choice combination that doesn't match either the correct response rule or any of the targeted feedback rules.
//       updateIncorrectCatchallRules(state, targetedFeedbackRules);
//     },
//   },
// });

function removeFromList<T>(item: T, list: T[]) {
  const index = list.findIndex((x) => x === item);
  if (index > -1) {
    list.splice(index, 1);
  }
  return list;
}
function addOrRemoveFromList<T>(item: T, list: T[]) {
  if (list.find((x) => x === item)) {
    return removeFromList(item, list);
  }
  list.push(item);
  return list;
}

{
  /* {ActivityTypes.isTargetedFeedbackEnabled(model) && (
              <TargetedFeedback
                model={model}
                onEditFeedback={(responseId, feedbackContent) =>
                  dispatch(editResponseFeedback(responseId, feedbackContent))
                }
                onAddTargetedFeedback={() => dispatch(addTargetedFeedback())}
                onRemoveTargetedFeedback={(responseId: ActivityTypes.ResponseId) =>
                  dispatch(removeTargetedFeedback(responseId))
                }
                onEditTargetedFeedbackChoices={(
                  responseId: ActivityTypes.ResponseId,
                  choiceIds: ActivityTypes.ChoiceId[],
                ) => dispatch(editTargetedFeedbackChoices(responseId, choiceIds))}
              />
            )} */
}

// The default getCorrectResponse and getIncorrectResponse only work
// for models with one part and one correct response + one catch-all incorrect
// response. If an activity type has a different model, the response finding strategies
// should be passed.

// export const syncResponseRules = (model: HasTargetedFeedback) => {
//   // Always update the rule to match the correct response with the correct answer choices.
//   // updateCorrectResponseRule(model);

//   // The targeted rules list might be empty, or it might not.
//   const targetedFeedbackRules: Rule[] = [];
//   const allChoiceIds = model.choices.map((choice) => choice.id);
//   model.authoring.feedback.targeted.forEach((assoc) => {
//     const targetedRule = createRuleForIds(
//       getChoiceIds(assoc),
//       setDifference(allChoiceIds, getChoiceIds(assoc)),
//     );
//     targetedFeedbackRules.push(targetedRule);
//     getResponse(model, getResponseId(assoc)).rule = targetedRule;
//   });

//   // Now for the catch-all incorrect response rule, which matches any choice combination that doesn't match either the correct response rule or any of the targeted feedback rules.
//   getIncorrectResponse(model).rule = unionRules(
//     targetedFeedbackRules.map(invertRule).concat([invertRule(getCorrectResponse(model).rule)]),
//   );
// };
