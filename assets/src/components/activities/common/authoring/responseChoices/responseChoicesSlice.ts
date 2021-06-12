import { createSlice } from '@reduxjs/toolkit';
import { ChoiceId, ResponseId } from 'components/activities/types';
import { answerKeySlice } from '../AnswerKey/slice';
import { HasParts } from '../parts/types';
import { IResponse } from '../responses/types';

// no partial credit -> one correct answer
const isCorrectResponse = (response: IResponse) => response.score === 1;
export const selectCorrectChoiceIds = (state: { responsesChoices: ResponseChoice[] } & HasParts) =>
  state.responsesChoices;

export interface ResponseChoice {
  choiceId: ChoiceId;
  responseId: ResponseId;
}
export const responsesChoicesSlice = createSlice({
  name: 'responsesChoices',
  initialState: [] as ResponseChoice[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(answerKeySlice.actions.toggleCorrectness.match, (state, action) => {
      // update correct response
      // update incorrect response
    });
  },
});
