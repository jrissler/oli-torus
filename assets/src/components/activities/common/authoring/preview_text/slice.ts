import { createSlice } from '@reduxjs/toolkit';
import { toSimpleText } from 'components/editing/utils';
import { stemSlice } from '../../stem/authoring/slice';
import { HasPreviewText } from './types';

export const selectPreviewText = (state: HasPreviewText) => state.authoring.previewText;
export const previewTextSlice = createSlice({
  name: 'previewText',
  initialState: '',
  reducers: {
    set(state, action) {
      return action.payload;
    },
  },
  extraReducers: {
    [stemSlice.actions.set.type]: (state, action) => {
      return toSimpleText({ children: action.payload.model });
    },
  },
});
