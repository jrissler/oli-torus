import { Action, createSlice } from '@reduxjs/toolkit';
import { HasTransformations, IOperation, ITransformation, makeTransformation } from './types';

type State = ITransformation[];
export const transformationsSlice = createSlice({
  name: 'transformations',
  initialState: [] as State,
  reducers: {
    toggleAnswerChoiceShuffling(state, action: Action) {
      if (isShuffled(state)) {
        return state.filter((xform) => xform.operation !== IOperation.shuffle);
      }
      state.push(makeTransformation('choices', IOperation.shuffle));
    },
  },
});
export const isShuffled = (state: State): boolean =>
  !!state.find((xform) => xform.operation === IOperation.shuffle);

const selectState = (state: HasTransformations) => state.authoring.transformations;
export const selectAllTransformations = selectState;
