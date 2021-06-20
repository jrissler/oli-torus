import { createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import { ChoiceId, ResponseId } from 'data/content/activities/activity';
import { IResponse, IRule } from 'data/content/activities/response';
import { ID } from 'data/content/model';
import { Maybe } from 'tsmonad';
import { feedbackSlice } from '../../feedback/slice';
import { addOne, findById, removeOne, updateOne } from '../../reduxUtils';
import {
  ResponseMapping,
  ResponseMappings,
  responseMappingSlice,
  toggleChoice,
} from '../responseChoices/responseChoicesSlice';
import { createRuleForIds, invertRule, unionRules } from './rules';

// const updateTargetedResponseRule = (
//   response: IResponse,
//   targetedChoiceIds: ChoiceId[],
//   allChoiceIds: ChoiceId[],
// ) =>

const updateIncorrectCatchallRule = (incorrectResponse: IResponse, targetedRules: IRule[]) => {
  incorrectResponse.rule = unionRules(targetedRules.map(invertRule));
};

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

// const adapter = createEntityAdapter<UIResponse>();
// type State = {
//   mappings: ResponseMappings;
//   responses: ReturnType<typeof adapter.getInitialState>;
// };
export const responsesSlice = createSlice({
  name: 'responses',
  initialState: [] as IResponse[],
  reducers: {
    // addOne: (state, action) => adapter.addOne,
    // updateOne: adapter.updateOne,
    // removeOne: adapter.updateOne,
    addOne: (state, action: PayloadAction<{ partId: ID; response: IResponse }>) =>
      addOne(state, action.payload.response),
    updateOne: (state, action: PayloadAction<{ partId: ID } & Update<IResponse>>) =>
      updateOne<IResponse>(state, action.payload),
    removeOne: (state, action: PayloadAction<{ partId: ID; id: ResponseId }>) =>
      removeOne<IResponse>(state, action.payload.id),
    updateRulesForMappings(
      state,
      action: PayloadAction<{ mappings: ResponseMappings; allChoiceIds: ChoiceId[] }>,
    ) {
      const targetedRules: IRule[] = [];
      const targetedMappings = [
        action.payload.mappings.correct,
        ...action.payload.mappings.targeted,
      ];
      targetedMappings.forEach((mapping) => {
        const newRule = createRuleForIds(
          mapping.choiceIds,
          action.payload.allChoiceIds.filter((id) => !mapping.choiceIds.includes(id)),
        );
        targetedRules.push(newRule);
        findById(state, mapping.responseId).rule = newRule;
      });

      findById(state, action.payload.mappings.incorrect.responseId).rule = unionRules(
        targetedRules.map(invertRule),
      );
      // Always update the rule to match the correct response with the correct answer choices.

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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(responseMappingSlice.actions.toggleChoice, (state, action) => {
        // const responses = action.payload.
      })
      .addMatcher(feedbackSlice.actions.update.match, (state, action) => {
        Maybe.maybe(state.find((response) => response.feedback.id === action.payload.id)).lift(
          (response) => (response.feedback = feedbackSlice.reducer(response.feedback, action)),
        );
      });

    // responseMappingSlice.actions.toggleChoice.match,
    // (state, { payload: { partId, choiceId, responseId } }) => {
    //   const newResponseMappings = responseMappingSlice.reducer()
    // },
    // );
  },
  //
  //   .addMatcher(responseMappingSlice.actions.addTargetedResponse.match, (state, action) => {
  //     state.push(action.payload.response);
  //   });
  // },
});

// export const selectAllResponsesByPartId = (partId: ID, state: HasParts) =>
//   selectPartById(partId, state)?.responses;
// export const selectResponseByFeedbackId = (feedbackId: EntityId, state: HasParts) =>
//   selectAllResponses(state).find((response) => response.feedback.id === feedbackId);

// updateOne(state, {
//   id: action.payload.responseId,
//   changes: {
//     feedback: feedbackSlice.reducer(
//       findById<IResponse>(state, action.payload.responseId)?.feedback,
//       action,
//     ),
//   },
// });
