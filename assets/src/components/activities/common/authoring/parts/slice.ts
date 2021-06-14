import { createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { HintId, ResponseId } from 'components/activities/types';
import { ID } from 'data/content/model';
import { current } from 'immer';
import { feedbackSlice } from '../../feedback/slice';
import { IFeedback } from '../../feedback/types';
import { hintsSlice } from '../../hints/authoring/slice';
import { IHint } from '../../hints/types';
import { findById, updateOne } from '../../reduxUtils';
import { toggleAnswerChoice } from '../answerKey/simple/slice';
import { responsesSlice } from '../responses/slice';
import { IResponse } from '../responses/types';
import { HasParts, IPart } from './types';

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
          updateOne(state, {
            id: action.payload.partId,
            changes: {
              hints: hintsSlice.reducer(findById(state, action.payload.partId)?.hints, action),
            },
          });
        },
      )
      .addMatcher(
        feedbackSlice.actions.update.match,
        (state, action) => {
          const part = state.find((part) =>
            part.responses.find((response) => response.feedback.id === action.payload.id),
          );
          if (part) {
            part.responses = responsesSlice.reducer(part.responses, action);
          }
        },
      )
  },
});

const selectState = (state: HasParts) => state.authoring.parts;

export const selectAllParts = selectState;
export const selectPartById = (partId: ID, state: HasParts) =>
  selectAllParts(state).find((part) => part.id === partId);
export const selectPartByResponseId = (responseId: ID, state: HasParts) =>
  selectAllParts(state).reduce(
    (acc, part) =>
      acc ? acc : part.responses.find((response) => response.id === responseId) && part,
    undefined,
  );

export const selectAllResponses = (state: HasParts) =>
  selectAllParts(state).reduce((acc, x) => acc.concat(x.responses), [] as IResponse[]);
export const selectAllResponsesByPartId = (partId: ID, state: HasParts) =>
  selectPartById(partId, state)?.responses;
export const selectResponseById = (responseId: ResponseId, state: HasParts) =>
  selectAllResponses(state).find((response) => response.id === responseId);
export const selectResponseByFeedbackId = (feedbackId: EntityId, state: HasParts) =>
  selectAllResponses(state).find((response) => response.feedback.id === feedbackId);

export const selectAllFeedback = (state: HasParts) =>
  selectAllResponses(state).reduce((acc, x) => acc.concat(x.feedback), [] as IFeedback[]);
export const selectFeedbackById = (feedbackId: ID, state: HasParts) =>
  selectAllResponses(state).find((response) => response.feedback.id === feedbackId);

export const selectAllHints = (state: HasParts) =>
  selectAllParts(state).reduce((acc, x) => acc.concat(x.hints), [] as IHint[]);
export const selectAllHintsByPartId = (partId: ID, state: HasParts) =>
  selectPartById(partId, state)?.hints;
export const selectHintById = (hintId: HintId, state: HasParts) =>
  selectAllHints(state).find((hint) => hint.id === hintId);
