import { createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import { Hint, HintId } from 'components/activities/types';
import { ID } from 'data/content/model';
import { removeOne, updateOne } from '../../reduxUtils';

export const hintsSlice = createSlice({
  name: 'hints',
  initialState: [] as Hint[],
  reducers: {
    addOne(state, action: PayloadAction<{ partId: ID; hint: Hint }>) {
      // new hints are always cognitive hints. they should be inserted
      // right before the "bottom out" hint at the end of the list
      state.splice(state.length - 1, 0, action.payload.hint);
    },
    updateOne: (state, action: PayloadAction<{ partId: ID } & Update<Hint>>) =>
      updateOne<Hint>(state, action),
    removeOne: (state, action: PayloadAction<{ partId: ID; id: HintId }>) =>
      removeOne<Hint>(state, { payload: action.payload.id }),
  },
});
