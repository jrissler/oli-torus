import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
  Slice,
} from '@reduxjs/toolkit';
import { CataRootState } from 'components/activities/check_all_that_apply/CheckAllThatApplyAuthoring';
import { ChoiceId } from 'components/activities/types';
import { updateOne, addOne, setAll, removeOne } from '../../reduxUtils';
import { HasChoices, IChoice } from '../types';

// export const adapter = createEntityAdapter<IChoice>();
// export type ChoicesState = EntityState<IChoice>;
// const initialState: ChoicesState = adapter.getInitialState();
// export const initChoices = (choices: IChoice[]) => adapter.upsertMany(initialState, choices);
export const choicesSlice = createSlice({
  name: 'choices',
  initialState: [] as IChoice[],
  reducers: {
    addOne: (state, action: PayloadAction<IChoice>) => addOne<IChoice>(state, action.payload),
    setAll: (state, action: PayloadAction<IChoice[]>) => setAll<IChoice>(state, action.payload),
    removeOne: (state, action: PayloadAction<ChoiceId>) =>
      removeOne<IChoice>(state, action.payload),
    updateOne: (state, action: PayloadAction<{ id: string; changes: Partial<IChoice> }>) =>
      updateOne<IChoice>(state, action.payload),
    // addOne: (state, action) => ,
    // setAll: adapter.setAll,
    // removeOne: adapter.removeOne,
    // updateOne: adapter.updateOne,
    // (state, action: PayloadAction<{ id: string; changes: Partial<IChoice> }>) =>
    //   updateOne<IChoice>(state, action),
  },
});

// SELECTORS
const selectState = (state: HasChoices): IChoice[] => state[choicesSlice.name];
export const selectAllChoices = createSelector(selectState, (state) => state);
export const selectChoiceById = (state: HasChoices, id: ChoiceId) =>
  selectAllChoices(state).find((choice) => choice.id === id);
// export const selectCurrentActivityId = createSelector(
//   selectState,
//   (state) => state.currentActivityId,
// );
// const { selectAll, selectById, selectTotal } = createEntityAdapter().getSelectors(s =>);
// export const selectAllChoices = selectAll;
// export const selectChoiceById = selectById;
// export const selectTotalChoices = selectTotal;
