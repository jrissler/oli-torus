import { createSelector, createSlice } from '@reduxjs/toolkit';
import { ChoiceId, ResponseId } from 'components/activities/types';
import { HasChoices } from '../../choices/types';
import { toggleAnswerChoice } from '../answerKey/simple/slice';
import { HasParts } from '../parts/types';

export type UntargetedResponseMapping = { responseId: ResponseId };
export type TargetedResponseMapping = {
  responseId: ResponseId;
  choiceIds: ChoiceId[];
};
export type ResponseMapping = TargetedResponseMapping | UntargetedResponseMapping;
export type ResponseMappings = {
  correct: TargetedResponseMapping;
  targeted: TargetedResponseMapping[];
  incorrect: UntargetedResponseMapping;
};
export type HasResponseMappings = {
  authoring: { responseMappings: ResponseMappings };
} & HasChoices &
  HasParts;
// export const isCorrectResponseMapping = (
//   mapping: ResponseMapping,
// ): mapping is CorrectResponseMapping => mapping.type === 'correct';
// export const isIncorrectResponseMapping = (
//   mapping: ResponseMapping,
// ): mapping is IncorrectResponseMapping => mapping.type === 'incorrect';
// export const isTargetedResponseMapping = (
//   mapping: ResponseMapping,
// ): mapping is TargetedResponseMapping => mapping.type === 'targeted';

export const responseMappingSlice = createSlice({
  name: 'responseMapppings',
  initialState: {} as ResponseMappings,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(toggleAnswerChoice.match, (state, { payload: { id, responseMapping } }) => {
      if (responseMapping.choiceIds.find((choiceId) => choiceId === id)) {
        responseMapping.choiceIds = responseMapping.choiceIds.filter((choiceId) => choiceId !== id);
      } else {
        responseMapping.choiceIds.push(id);
      }
    });
  },
});

/*
Simple mode (no targeted, no partial credit)
  Two responses.
    One is in this lookup table: correct answer choices to the response id
    One is not (it's not tied to answer choices, it's the negation of the correct answer choices)
  ToggleAnswerChoice (tied to a response)
    add or remove this from the correct response choice ids
    update this response rule with new choice ids
    update incorrect response catch-all rule with negation the union of all other responses
  For each part, the correct response is always the one matched by the choice ids here, and the is the other response

Targeted
  Many responses
    All but one are in the lookup table here
    One is not (the incorrect catchall response)
  ToggleAnswerChoice
    Add or remove this from the response that matches the response id from the action
    Update the rule of the matching response
    Update the incorrect response catch-all rule with the negation of the union of all other responses

  Responses:
    | {Correct, Incorrect}
    | {Correct, ...TargetedResponses, Incorrect}
    | {Correct, Incorrect}

*/

const selectState = (state: HasResponseMappings) => state.authoring.responseMappings;
export const selectCorrectResponseMapping = createSelector(selectState, (state) => state.correct);
export const selectIncorrectResponseMapping = createSelector(
  selectState,
  (state) => state.incorrect,
);
export const selectTargetedResponseMappings = createSelector(
  selectState,
  (state) => state.incorrect,
);

// export const selectChoiceIdsByResponseId = (responseId: ResponseId, state: HasResponseMappings) =>
//   selectState(state)
//     .filter((mapping) => mapping.responseId === responseId)
//     .map((mapping) => mapping.choiceId);

// export const selectChoicesByResponseId = (responseId: ResponseId, state: HasResponseMappings) =>
//   selectChoiceIdsByResponseId(responseId, state).map((choiceId) =>
//     selectChoiceById(state, choiceId),
//   );

// export const selectResponseIdsByChoiceId = (choiceId: ChoiceId, state: HasResponseMappings) =>
//   selectState(state)
//     .filter((mapping) => mapping.choiceId === choiceId)
//     .map((mapping) => mapping.responseId);

// export const selectResponsesByChoiceId = (choiceId: ChoiceId, state: HasResponseMappings) =>
//   selectResponseIdsByChoiceId(choiceId, state).map((responseId) =>
//     selectResponseById(responseId, state),
//   );
