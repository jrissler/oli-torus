import { createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import { ResponseId } from 'components/activities/types';
import { ID } from 'data/content/model';
import { feedbackSlice } from '../../feedback/slice';
import { addOne, removeOne, updateOne } from '../../reduxUtils';
import { toggleAnswerChoice } from '../answerKey/simple/slice';
import { IResponse } from './types';

export const responsesSlice = createSlice({
  name: 'responses',
  initialState: [] as IResponse[],
  reducers: {
    // addOne: (state, action: PayloadAction<{ partId: ID; response: IResponse }>) =>
    //   addOne(state, action.payload.response),
    // updateOne: (state, action: PayloadAction<{ partId: ID } & Update<IResponse>>) =>
    //   updateOne<IResponse>(state, action.payload),
    // removeOne: (state, action: PayloadAction<{ partId: ID; id: ResponseId }>) =>
    //   removeOne<IResponse>(state, action.payload.id),
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(feedbackSlice.actions.update.match, (state, action) => {
        const response = state.find((response) => response.feedback.id === action.payload.id);
        if (response) {
          response.feedback = feedbackSlice.reducer(response.feedback, action);
        }
      })
      .addMatcher(toggleAnswerChoice.match, (state, { payload: { id, responseMapping } }) => {
        const response = state.find((response) => response.id === responseMapping.responseId);
        if (response) {
          // need all answer choices here
          response.rule;
        }
      });
  },
});

// updateOne(state, {
//   id: action.payload.responseId,
//   changes: {
//     feedback: feedbackSlice.reducer(
//       findById<IResponse>(state, action.payload.responseId)?.feedback,
//       action,
//     ),
//   },
// });
