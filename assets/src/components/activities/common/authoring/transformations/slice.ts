import { createSlice } from '@reduxjs/toolkit';
import { toggleAnswerChoiceShuffling } from '../../utils';
import { makeTransformation } from '../utils';
import { IOperation, ITransformation } from './types';

export const isShuffled = (transformations: ITransformation[]): boolean =>
  !!transformations.find((xform) => xform.operation === IOperation.shuffle);

export const transformationsSlice = createSlice({
  name: 'transformations',
  initialState: [] as ITransformation[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(toggleAnswerChoiceShuffling.name, (state, action) => {
      if (isShuffled(state)) {
        return state.filter((xform) => xform.operation !== IOperation.shuffle);
      }
      state.push(makeTransformation('choices', IOperation.shuffle));
    });
  },
});
