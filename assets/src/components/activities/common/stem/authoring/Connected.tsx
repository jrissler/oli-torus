import { createSelector } from '@reduxjs/toolkit';
import { RichText } from 'components/activities/types';
import { connect } from 'react-redux';
import { HasStem } from '../types';
import { stemSlice } from './slice';
import { Unconnected } from './Unconnected';

export const selectStem = createSelector(
  (state: HasStem) => state.stem,
  (stem) => ({ stem }),
);
export const Connected = connect(selectStem, (dispatch) => ({
  update: (content: RichText) => dispatch(stemSlice.actions.update({ changes: { content } })),
}))(Unconnected);
