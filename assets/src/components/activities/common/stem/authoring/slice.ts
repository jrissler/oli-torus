import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit';
import { CataRootState } from 'components/activities/check_all_that_apply/CheckAllThatApplyAuthoring';
import { RichText } from 'components/activities/types';
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

const selectState = (state: CataRootState) => state.stem;
export const selectStem = createSelector(selectState, (stem) => stem);
