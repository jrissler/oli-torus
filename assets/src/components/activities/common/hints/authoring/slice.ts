import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit';
import { ID } from 'data/content/model';
import { addOne, removeOne, updateOne } from '../../reduxUtils';
import { HintId } from 'data/content/activities/activity';
import { IHint } from 'data/content/activities/hint';

export const hintsSlice = createSlice({
  name: 'hints',
  initialState: [] as IHint[],
  reducers: {
    addOne: (state, action: PayloadAction<{ partId: ID; hint: IHint }>) =>
      addOne(state, action.payload.hint),
    updateOne: (state, action: PayloadAction<{ partId: ID } & Update<IHint>>) =>
      updateOne(state, action.payload),
    removeOne: (state, action: PayloadAction<{ partId: ID; id: HintId }>) =>
      removeOne(state, action.payload.id),
    // addOne(state, action: PayloadAction<UIHint>) {
    //   state.mappings = hintMappings.reducer(state.mappings, action);
    //   state.hints = hintEntities.reducer(state.hints, action);
    // },
    // updateOne(state, action: PayloadAction<Update<UIHint>>) {
    //   state.hints = hintEntities.reducer(state.hints, action);
    // },
    // removeOne(state, action: PayloadAction<{ id: HintId; partId: ID }>) {
    //   state.mappings = hintMappings.reducer(state.mappings, action);
    //   state.hints = hintEntities.reducer(state.hints, action);
    // },
  },
});

// const hintEntities = createSlice({
//   name: 'hintEntities',
//   initialState: adapter.getInitialState(),
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addMatcher(hintsSlice.actions.addOne.match, adapter.addOne)
//       .addMatcher(hintsSlice.actions.updateOne.match, adapter.updateOne)
//       .addMatcher(hintsSlice.actions.removeOne.match, (state, action) =>
//         adapter.removeOne(state, action.payload.id),
//       );
//   },
// });
// const hintMappings = createSlice({
//   name: 'hintMappings',
//   initialState: {} as HintMappings,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addMatcher(hintsSlice.actions.addOne.match, (state, action) => {
//         state[action.payload.partId].cognitive.push(action.payload.id);
//       })
//       .addMatcher(hintsSlice.actions.removeOne.match, (state, action) => {
//         state[action.payload.partId].cognitive = state[action.payload.partId].cognitive.filter(
//           (hintId) => hintId !== action.payload.id,
//         );
//       });
//   },
// });

// TODO: Refactor to look up by partId

// new hints are always cognitive hints. they should be inserted
// right before the "bottom out" hint at the end of the list
// const hint = action.payload;
// state.entities[hint.id] = hint;
// state.ids.splice(state.ids.length - 1, 0, hint.id);
