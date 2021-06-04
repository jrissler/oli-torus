import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HasStem, RichText, Stem } from 'components/activities/types';
import { makeStem } from '../authoring/utils';

const initialState: Stem = makeStem('');
export const stemSlice = createSlice({
  name: 'stem',
  initialState,
  reducers: {
    set(state, action: PayloadAction<RichText>) {
      state.content = action.payload;
    },
  },
});
// export const selectStem = (state: HasStem) => state.stem;
