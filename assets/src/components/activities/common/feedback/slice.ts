import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ID } from 'data/content/model';
import { update } from '../reduxUtils';
import { IFeedback, makeFeedback } from './types';

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: makeFeedback(''),
  reducers: {
    update: (
      state,
      action: PayloadAction<{ partId: ID; responseId: ID; changes: Partial<IFeedback> }>,
    ) => update<IFeedback>(state, action),
  },
});
