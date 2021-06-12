import { createSlice } from '@reduxjs/toolkit';
import { feedbackSlice } from '../../feedback/slice';
import { findById, updateOne } from '../../reduxUtils';
import { IResponse } from './types';

export const responsesSlice = createSlice({
  name: 'responses',
  initialState: [] as IResponse[],
  reducers: {
    updateOne,
    // update rules here too with updateone, call rule reducer
  },
  extraReducers: (builder) => {
    builder.addMatcher(feedbackSlice.actions.update.match, (state, action) => {
      updateOne(state, {
        payload: {
          id: action.payload.responseId,
          changes: {
            feedback: feedbackSlice.reducer(
              findById<IResponse>(state, action.payload.responseId)?.feedback,
              action,
            ),
          },
        },
      });
    });
  },
});
