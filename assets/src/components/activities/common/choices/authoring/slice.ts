import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Choice, ChoiceId } from 'components/activities/types';
import { updateOne, addOne, setAll, removeOne } from '../../reduxUtils';

export const choicesSlice = createSlice({
  name: 'choices',
  initialState: [] as Choice[],
  reducers: {
    // addOne: (state, action: PayloadAction<Choice>) => addOne<Choice>(state, action),
    // setAll: (state, action: PayloadAction<Choice[]>) => setAll<Choice>(state, action),
    // removeOne: (state, action: PayloadAction<ChoiceId>) => removeOne<Choice>(state, action),
    // updateOne: (state, action: PayloadAction<{ id: string; changes: Partial<Choice> }>) =>
    //   updateOne<Choice>(state, action),
    addOne,
    setAll,
    removeOne,
    updateOne: (state, action: PayloadAction<{ id: string; changes: Partial<Choice> }>) =>
      updateOne<Choice>(state, action),
  },
});
