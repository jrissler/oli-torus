import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  Slice,
} from '@reduxjs/toolkit';
import { CataRootState } from 'components/activities/check_all_that_apply/CheckAllThatApplyAuthoring';
import { toggleAnswerChoiceShuffling } from '../../utils';
import { HasTransformations, IOperation, ITransformation, makeTransformation } from './types';

export const isShuffled = (transformations: ITransformation[]): boolean =>
  !!transformations.find((xform) => xform.operation === IOperation.shuffle);

// const adapter = createEntityAdapter<ITransformation>();
export const transformationsSlice = createSlice({
  name: 'transformations',
  initialState: [] as ITransformation[],
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(toggleAnswerChoiceShuffling.name, (state, action) => {
    //   if (isShuffled(state)) {
    //     return state.filter((xform) => xform.operation !== IOperation.shuffle);
    //   }
    //   state.push(makeTransformation('choices', IOperation.shuffle));
    // });
  },
});

const selectState = (state: HasTransformations) => state.authoring.transformations;
export const selectAllTransformations = selectState;
