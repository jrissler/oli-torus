import { createEntityAdapter, createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import { HintId } from 'components/activities/types';
import { ID } from 'data/content/model';
import { IPart } from '../../authoring/parts/types';
import { removeOne, updateOne } from '../../reduxUtils';
import { IHint } from '../types';

export const hintsAdapter = createEntityAdapter<IHint>();
// export const loadHintsState = (parts: IPart[]) =>
//   hintsAdapter.setAll(
//     hintsAdapter.getInitialState(),
//     parts.reduce(
//       (hints, part) => hints.concat(part.hints.map((hint) => ({ ...hint, partId: part.id }))),
//       [] as HintEntity[],
//     ),
//   );

export const hintsSlice = createSlice({
  name: 'hints',
  initialState: [] as IHint[],
  reducers: {
    addOne(state, action: PayloadAction<{ partId: ID; hint: IHint }>) {
      // new hints are always cognitive hints. they should be inserted
      // right before the "bottom out" hint at the end of the list
      state.splice(state.length - 1, 0, action.payload.hint);
    },
    updateOne: (state, action: PayloadAction<{ partId: ID } & Update<IHint>>) =>
      updateOne<IHint>(state, action.payload),
    removeOne: (state, action: PayloadAction<{ partId: ID; id: HintId }>) =>
      removeOne<IHint>(state, action.payload.id),
  },
});
