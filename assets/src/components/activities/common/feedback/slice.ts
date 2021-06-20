import { createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import { ID } from 'data/content/model';
import { update } from '../reduxUtils';
import { IFeedback } from './types';

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {} as IFeedback,
  reducers: {
    update(state, action: PayloadAction<{ partId: ID } & Update<IFeedback>>) {
      update(state, action.payload.changes);
    },
  },
});
