import { createAction, createReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HasStem, RichText, Stem } from 'components/activities/types';
import { makeStem } from '../authoring/utils';

// const initialState: HasStem = { stem: makeStem('') };
// export const stemSlice = createSlice({
//   name: 'stem',
//   initialState,
//   reducers: {
//     set(state, action: PayloadAction<RichText>) {
//       state.stem.content = action.payload;
//     },
//   },
// });
// export const selectStem = (state: HasStem) => state.stem;

// export const stemReducer = createReducer(initialState, (builder) => {
//   builder.addCase(createAction<RichText>('set'), (state, action) => {
//     console.log('action', action);
//     state.content = action.payload;
//   });
// });
// export const selectStem = (state: Stem) => state.stem;
