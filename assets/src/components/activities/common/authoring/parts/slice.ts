import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Part } from 'components/activities/types';
import { ID } from 'data/content/model';
import { feedbackSlice } from '../../feedback/slice';
import { hintsSlice } from '../../hints/authoring/slice';
import { updateOne } from '../../reduxUtils';
import { responsesSlice } from '../responses/slice';

export const partsSlice = createSlice({
  name: 'parts',
  initialState: [] as Part[],
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
          updateOne<Part>(state, {
            payload: {
              id: action.payload.partId,
              changes: { hints: hintsSlice.reducer(state[0].hints, action) },
            },
          });
        },
      )
      .addMatcher(
        (action) =>
          [
            // responsesSlice.actions.addOne,
            // responsesSlice.actions.removeOne,
            responsesSlice.actions.updateOne,
            feedbackSlice.actions.update,
            // add responses actions here
          ].some((ac) => ac.match(action)),
        (state, action: PayloadAction<{ partId: ID }>) => {
          updateOne<Part>(state, {
            payload: {
              id: action.payload.partId,
              changes: { responses: responsesSlice.reducer(state[0].responses, action) },
            },
          });
        },
      );
    // .addMatcher(
    //   (action) => feedbackSlice.actions.update.match(action),
    //   (state, action: PayloadAction<{ partId: ID }>) => {
    //     updateOne(state, {
    //       payload: {
    //         id: action.payload.partId,
    //         changes: { responses: responsesSlice.reducer(state[0].responses, action) },
    //       },
    //     });
    //   },
    // );
  },
});
