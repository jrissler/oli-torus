import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChoiceId } from 'components/activities/types';
import { IChoice } from '../../choices/types';
import { makeStem } from '../../stem/types';

export const answerKeySlice = createSlice({
  name: 'answerKey',
  initialState: { stem: makeStem(''), choices: [] as IChoice[] },
  reducers: {
    toggleCorrectness(state, action: PayloadAction<ChoiceId>) {
      return state;

      // const addOrRemoveId = (list: string[]) => addOrRemoveFromList(choiceId, list);
      // // targeted response choices do not need to change

      // addOrRemoveId(getChoiceIds(model.authoring.correct));
      // addOrRemoveId(getChoiceIds(model.authoring.incorrect));
      // syncResponseRules(state);

      // // need to dispatch choices updated -> response rules are changed
    },
  },
});
