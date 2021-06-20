import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootActivityState } from 'components/activities/ActivityContext';
import { ChoiceId } from 'data/content/activities/activity';
import { HasChoices, IChoice } from 'data/content/activities/choice';
import { addOne, removeOne, setAll, updateOne } from '../../reduxUtils';

// export const adapter = createEntityAdapter<IChoice>();
// export type ChoicesState = ReturnType<typeof adapter.getInitialState>;
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
    // addOne: adapter.addOne,
    // setAll: adapter.setAll,
    // removeOne: adapter.removeOne,
    // updateOne: adapter.updateOne,
  },
});

// SELECTORS
const selectState = (state: HasChoices) => state.choices;
// export const selectAllChoices = createSelector(selectState, (state) => state);
// export const selectChoiceById = (state: HasChoices, id: ChoiceId) =>
//   selectAllChoices(state).find((choice) => choice.id === id);
// const { selectAll } = adapter.getSelectors(selectState);
export const selectAllChoices = createSelector(selectState, (state) => state);
export const selectChoiceById = (state: HasChoices, id: ChoiceId) =>
  selectState(state).find((choice) => choice.id === id);
