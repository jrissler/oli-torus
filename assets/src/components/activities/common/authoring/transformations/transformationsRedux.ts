import { HasTransformations, Operation } from 'components/activities/types';
import { createSlice } from '@reduxjs/toolkit';
import { isShuffled, makeTransformation } from '../utils';

export const transformationsSlice = createSlice({
  name: 'transformations',
  initialState: [makeTransformation('', Operation.shuffle)],
  reducers: {
    toggleAnswerChoiceShuffling(state) {
      if (isShuffled(state)) {
        return state.filter((xform) => xform.operation !== Operation.shuffle);
      } else {
        state.push(makeTransformation('choices', Operation.shuffle));
      }
    },
  },
});

export const selectTransformations = (state: HasTransformations) => state.authoring.transformations;
