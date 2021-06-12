import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RichText } from 'components/activities/types';
import { HasStem, makeStem } from '../types';

export const selectStem = (state: HasStem) => state.stem;
export const stemSlice = createSlice({
  name: 'stem',
  initialState: makeStem(''),
  reducers: {
    set(state, action: PayloadAction<RichText>) {
      state.content = action.payload;
    },
  },
});
