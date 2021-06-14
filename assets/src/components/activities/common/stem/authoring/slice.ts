import { createEntityAdapter, createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import { RichText } from 'components/activities/types';
import { update } from '../../reduxUtils';
import { HasStem, IStem, makeStem } from '../types';

export const selectStem = (state: HasStem) => state.stem;
// const stemAdapter = createEntityAdapter<IStem>();
export const stemSlice = createSlice({
  name: 'stem',
  initialState: makeStem(''),
  reducers: {
    // set: (state, action: PayloadAction<IStem>) => action.payload,
    update: (state, action: PayloadAction<{ changes: Partial<IStem> }>) =>
      update<IStem>(state, action.payload.changes),
    // set(state, action: PayloadAction<RichText>) {
    //   state.content = action.payload;
    // },
  },
});
