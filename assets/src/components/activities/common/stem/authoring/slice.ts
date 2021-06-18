import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit';
import { update } from '../../reduxUtils';
import { HasStem, IStem, makeStem } from '../types';

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

const selectState = (state: HasStem) => state.stem;
export const selectStem = createSelector(selectState, (stem) => stem);
