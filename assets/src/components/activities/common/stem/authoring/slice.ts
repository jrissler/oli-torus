import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit';
import { RootActivityState } from 'components/activities/ActivityContext';
import { HasStem, IStem, makeStem } from 'data/content/activities/stem';
import { update } from '../../reduxUtils';

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
