import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChoiceId, ResponseId } from 'components/activities/types';
import { ID } from 'data/content/model';
import { Maybe } from 'tsmonad';
import { HasChoices } from '../../choices/types';
import { HasParts } from '../parts/types';
import { IResponse } from '../responses/types';

export type UntargetedResponseMapping = { responseId: ResponseId };
export type TargetedResponseMapping = {
  responseId: ResponseId;
  choiceIds: ChoiceId[];
};
export type ResponseMapping = TargetedResponseMapping | UntargetedResponseMapping;
export type ResponseMappings = {
  partId: ID;
  correct: TargetedResponseMapping;
  targeted: TargetedResponseMapping[];
  incorrect: UntargetedResponseMapping;
};
export type HasResponseMappings = {
  authoring: { responseMappings: ResponseMappings[] };
} & HasChoices &
  HasParts;

export const responseMappingSlice = createSlice({
  name: 'responseMapppings',
  initialState: [] as ResponseMappings[],
  reducers: {
    toggleChoice(state, action: PayloadAction<{ partId: ID; choiceId: ID; responseId: ID }>) {
      Maybe.maybe(state.find((mapping) => mapping.partId === action.payload.partId))
        .lift((mappings) =>
          [mappings.correct, ...mappings.targeted].find(
            (mapping) => mapping.responseId === action.payload.responseId,
          ),
        )
        .lift((mapping) =>
          mapping?.choiceIds.find((choiceId) => choiceId === action.payload.choiceId)
            ? (mapping.choiceIds = mapping.choiceIds.filter((id) => id !== action.payload.choiceId))
            : mapping?.choiceIds.push(action.payload.choiceId),
        );
    },
    addTargetedResponse(state, action: PayloadAction<{ partId: ID; responseId: ResponseId }>) {
      Maybe.maybe(state.find((mapping) => mapping.partId === action.payload.partId)).lift(
        (mapping) =>
          mapping.targeted.push({ responseId: action.payload.responseId, choiceIds: [] }),
      );
    },
  },
  extraReducers: (builder) => {
    // builder.addMatcher(toggleAnswerChoice.match, (state, { payload: { id, responseMapping } }) => {
    //   if (responseMapping.choiceIds.find((choiceId) => choiceId === id)) {
    //     responseMapping.choiceIds = responseMapping.choiceIds.filter((choiceId) => choiceId !== id);
    //   } else {
    //     responseMapping.choiceIds.push(id);
    //   }
    // });
  },
});

const selectState = (state: HasResponseMappings) => state.authoring.responseMappings;

export const selectResponseMappingsByPartId = (state: HasResponseMappings, partId: ID) =>
  Maybe.maybe(selectState(state).find((mapping) => mapping.partId === partId)).valueOrThrow(
    new Error('Could not find response mapping for part id ' + partId),
  );
