import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit';
import { ResponseId } from 'components/activities/types';
import { ID } from 'data/content/model';
import { schema } from 'normalizr';
import { omit } from 'ramda';
import { Maybe } from 'tsmonad';
import { feedbackSlice } from '../../feedback/slice';
import { addOne, removeOne, updateOne } from '../../reduxUtils';
import { HasParts } from '../parts/types';
import { ResponseMappings } from '../responseChoices/responseChoicesSlice';
import { IResponse, UIResponse } from './types';

// const adapter = createEntityAdapter<UIResponse>();
// type State = {
//   mappings: ResponseMappings;
//   responses: ReturnType<typeof adapter.getInitialState>;
// };
export const responsesSlice = createSlice({
  name: 'responses',
  initialState: [] as IResponse[],
  reducers: {
    // addOne: (state, action) => adapter.addOne,
    // updateOne: adapter.updateOne,
    // removeOne: adapter.updateOne,
    addOne: (state, action: PayloadAction<{ partId: ID; response: IResponse }>) =>
      addOne(state, action.payload.response),
    updateOne: (state, action: PayloadAction<{ partId: ID } & Update<IResponse>>) =>
      updateOne<IResponse>(state, action.payload),
    removeOne: (state, action: PayloadAction<{ partId: ID; id: ResponseId }>) =>
      removeOne<IResponse>(state, action.payload.id),
  },
  extraReducers: (builder) => {
    builder.addMatcher(feedbackSlice.actions.update.match, (state, action) => {
      Maybe.maybe(state.find((response) => response.feedback.id === action.payload.id)).lift(
        (response) => (response.feedback = feedbackSlice.reducer(response.feedback, action)),
      );
    });
  },
  //   .addMatcher(toggleAnswerChoice.match, (state, { payload: { id, responseMapping } }) => {
  //     const response = state.find((response) => response.id === responseMapping.responseId);
  //     if (response) {
  //       // need all answer choices here
  //       response.rule;
  //     }
  //   })
  //   .addMatcher(responseMappingSlice.actions.addTargetedResponse.match, (state, action) => {
  //     state.push(action.payload.response);
  //   });
  // },
});

// export const responsesFromPersistence = (responses: IResponse[]): EntityState<UIResponse> => {

// };

// export const selectAllResponsesByPartId = (partId: ID, state: HasParts) =>
//   selectPartById(partId, state)?.responses;
// export const selectResponseByFeedbackId = (feedbackId: EntityId, state: HasParts) =>
//   selectAllResponses(state).find((response) => response.feedback.id === feedbackId);

// updateOne(state, {
//   id: action.payload.responseId,
//   changes: {
//     feedback: feedbackSlice.reducer(
//       findById<IResponse>(state, action.payload.responseId)?.feedback,
//       action,
//     ),
//   },
// });
