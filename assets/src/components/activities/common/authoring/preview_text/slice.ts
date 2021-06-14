import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toSimpleText } from 'components/editing/utils';
import { stemSlice } from '../../stem/authoring/slice';
import { HasPreviewText } from './types';

export const selectPreviewText = (state: HasPreviewText) => state.authoring.previewText;
export const previewTextSlice = createSlice({
  name: 'previewText',
  initialState: '',
  reducers: {
    set(state, action: PayloadAction<string>) {
      return action.payload;
    },
  },
  extraReducers: (builder) =>
    builder.addMatcher(stemSlice.actions.update.match, (state, action) => {
      const children = action.payload.changes.content?.model;
      if (children) {
        return toSimpleText({ children });
      }
    }),
});
