import { createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import { update } from '../reduxUtils';
import { IFeedback, makeFeedback } from './types';

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: makeFeedback(''),
  reducers: {
    update: (state, action: PayloadAction<Update<IFeedback>>) =>
      update(state, action.payload.changes),
  },
});
