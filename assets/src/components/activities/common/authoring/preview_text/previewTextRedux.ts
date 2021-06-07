import { toSimpleText } from 'components/editing/utils';
import { HasPreviewText } from 'components/activities/types';
import { createSlice } from '@reduxjs/toolkit';
import { stemSlice } from 'components/activities/check_all_that_apply/CheckAllThatApplyAuthoring';

console.log('action', stemSlice);
export const selectPreviewText = (state: HasPreviewText) => state.authoring.previewText;
export const previewTextSlice = createSlice({
  name: 'previewText',
  initialState: '',
  reducers: {
    set(state, action) {
      console.log('preview text action', action);
      return action.payload;
    },
  },
  extraReducers: {
    [stemSlice.actions.set.type]: (state, action) => {
      console.log('preview text action', action);

      return toSimpleText({ children: action.payload.model });
    },
  },
});
// export const previewTextReducer = createReducer('', (builder) => {
//   builder
//     .addCase(createAction<string>('set'), (state, action) => {
//       console.log('preview text action', action);
//       return action.payload;
//     })
//     .addCase(stemSlice.actions.set, (state, action) => {
//       console.log('preview text action', action);

//       return toSimpleText({ children: action.payload.model });
//     })
//     .addDefaultCase((state) => state);
// });
