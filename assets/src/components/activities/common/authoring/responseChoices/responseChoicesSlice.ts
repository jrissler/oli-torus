import {
  AnyAction,
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import { RootActivityState } from 'components/activities/ActivityContext';
import { ChoiceId, ResponseId } from 'data/content/activities/activity';
import { HasChoices } from 'data/content/activities/choice';
import { HasParts } from 'data/content/activities/part';
import { ID } from 'data/content/model';
import { Maybe } from 'tsmonad';
import { choicesSlice, selectAllChoices } from '../../choices/authoring/slice';
import { responsesSlice } from '../responses/slice';

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

// export const toggleChoice = createAsyncThunk<
//   Promise<void>,
//   { partId: ID; choiceId: ID; responseId: ID },
//   { state: HasChoices & HasResponseMappings }
// >('responseMappings/toggleChoice', async (payload, thunkApi) => {
//   thunkApi.dispatch(responseMappingSlice.actions.toggleChoice(payload));
//   const responseMappings = selectResponseMappingsByPartId(thunkApi.getState(), payload.partId);;
//   // thunkApi.dispatch(responsesSlice.actions.updateAllResponseRules(responseMappings));
// });

export const toggleChoice = (payload: {
  partId: ID;
  choiceId: ID;
  responseId: ID;
}): ThunkAction<void, HasResponseMappings & HasParts, unknown, AnyAction> => {
  return (dispatch, getState) => {
    dispatch(responseMappingSlice.actions.toggleChoice(payload));
    const mappings = selectResponseMappingsByPartId(getState(), payload.partId);
    const allChoiceIds = selectAllChoices(getState()).map((choice) => choice.id);
    responsesSlice.actions.updateRulesForMappings({ mappings, allChoiceIds });
  };
};

export const responseMappingSlice = createSlice({
  name: 'responseMapppings',
  initialState: [] as ResponseMappings[],
  reducers: {
    // clearChoices(state, action: )
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
    builder
      .addMatcher(choicesSlice.actions.removeOne.match, () => {
        // updateresponserules
      })
      .addMatcher(choicesSlice.actions.addOne.match, () => {
        // updateresponserules
      });

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
