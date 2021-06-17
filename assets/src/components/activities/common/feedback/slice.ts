import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit';
import { ResponseId } from 'components/activities/types';
import { ID } from 'data/content/model';
import { schema } from 'normalizr';
import { Maybe } from 'tsmonad';
import { selectResponseById } from '../authoring/parts/slice';
import { HasParts } from '../authoring/parts/types';
import { UIResponse } from '../authoring/responses/types';
import { update } from '../reduxUtils';
import { IFeedback, UIFeedback } from './types';

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {} as IFeedback,
  reducers: {
    update(state, action: PayloadAction<{ partId: ID } & Update<IFeedback>>) {
      update(state, action.payload.changes);
    },
  },
});
