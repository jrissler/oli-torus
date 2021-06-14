import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  Slice,
} from '@reduxjs/toolkit';
import { toggleAnswerChoiceShuffling } from '../../utils';
import { HasTransformations, IOperation, ITransformation, makeTransformation } from './types';

export const isShuffled = (transformations: ITransformation[]): boolean =>
  !!transformations.find((xform) => xform.operation === IOperation.shuffle);

type TransformationsState = ITransformation[];
export const transformationsSlice = createSlice({
  name: 'transformations',
  initialState: [] as TransformationsState,
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

const selectState = (state: HasTransformations) => state.authoring.transformations;
export const selectAllTransformations = createSelector(selectState, (state) => state);
