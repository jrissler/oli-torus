import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResponseId } from 'data/content/activities/activity';
import { IFeedback } from 'data/content/activities/feedback';
import { IHint } from 'data/content/activities/hint';
import { HasParts, IPart } from 'data/content/activities/part';
import { IResponse } from 'data/content/activities/response';
import { ID } from 'data/content/model';
import { Maybe } from 'tsmonad';
import { choicesSlice } from '../../choices/authoring/slice';
import { feedbackSlice } from '../../feedback/slice';
import { hintsSlice } from '../../hints/authoring/slice';
import { updateOne } from '../../reduxUtils';
import { responsesSlice } from '../responses/slice';

export const partsSlice = createSlice({
  name: 'parts',
  initialState: [] as IPart[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          [
            hintsSlice.actions.addOne,
            hintsSlice.actions.removeOne,
            hintsSlice.actions.updateOne,
          ].some((ac) => ac.match(action)),
        (state, action: PayloadAction<{ partId: ID }>) => {
          const part = Maybe.maybe(
            state.find((part) => part.id === action.payload.partId),
          ).valueOrThrow(new Error('Could not find part with id ' + action.payload.partId));
          updateOne(state, {
            id: action.payload.partId,
            changes: {
              hints: hintsSlice.reducer(part.hints, action),
            },
          });
        },
      )
      .addMatcher(
        (action) =>
          [
            responsesSlice.actions.addOne,
            responsesSlice.actions.removeOne,
            responsesSlice.actions.updateOne,
            responsesSlice.actions.updateRulesForMappings,
            // responsesSlice.actions.updateAllResponseRules,
          ].some((ac) => ac.match(action)),
        (state, action: PayloadAction<{ partId: ID }>) => {
          const part = Maybe.maybe(
            state.find((part) => part.id === action.payload.partId),
          ).valueOrThrow(new Error('Could not find part with id ' + action.payload.partId));
          updateOne(state, {
            id: action.payload.partId,
            changes: { responses: responsesSlice.reducer(part.responses, action) },
          });
        },
      )
      .addMatcher(choicesSlice.actions.removeOne.match, () => {
        // updateresponserules
      })
      .addMatcher(choicesSlice.actions.addOne.match, () => {
        // update response rules
      })
      .addMatcher(feedbackSlice.actions.update.match, (state, action) => {
        const part = Maybe.maybe(
          state.find((part) => part.id === action.payload.partId),
        ).valueOrThrow(new Error('Could not find part with id ' + action.payload.partId));
        part.responses = responsesSlice.reducer(part.responses, action);
      });
  },
});

const selectState = (state: HasParts) => state.authoring.parts;

export const selectAllParts = selectState;
export const selectPartById = (state: HasParts, id: ID) =>
  selectState(state).find((part) => part.id === id);

export const selectAllHintsByPartId = (state: HasParts, partId: ID): IHint[] =>
  Maybe.maybe(selectPartById(state, partId)?.hints).valueOrThrow(
    new Error('Could not find any hints for part id ' + partId),
  );

export const selectAllResponses = (state: HasParts): IResponse[] =>
  selectAllParts(state).reduce((acc, curr) => acc.concat(curr.responses), [] as IResponse[]);

export const selectAllResponsesByPartId = (state: HasParts, partId: ID): IResponse[] =>
  Maybe.maybe(selectPartById(state, partId)?.responses).valueOrThrow(
    new Error('Could not find any responses for part id ' + partId),
  );

export const selectResponseById = (state: HasParts, id: ResponseId): IResponse =>
  Maybe.maybe(selectAllResponses(state).find((response) => response.id === id)).valueOrThrow(
    new Error('Could not find response matching id ' + id),
  );

export const selectFeedbackById = (state: HasParts, id: ID) =>
  Maybe.maybe(
    selectAllResponses(state).find((response) => response.feedback.id === id),
  ).valueOrThrow(new Error('selectFeedbackById could not find id ' + id));
export const selectFeedbackByResponseId = (state: HasParts, responseId: ResponseId): IFeedback =>
  selectResponseById(state, responseId).feedback;
