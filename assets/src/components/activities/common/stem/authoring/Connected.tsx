import { createSelector } from '@reduxjs/toolkit';
import { RichText } from 'data/content/activities/activities';
import { connect } from 'react-redux';
import { HasStem } from '../types';
import { selectStem, stemSlice } from './slice';
import { Unconnected } from './Unconnected';

export const Connected = connect(
  (state: HasStem) => ({ stem: selectStem(state) }),
  (dispatch) => ({
    update: (content: RichText) => dispatch(stemSlice.actions.update({ changes: { content } })),
  }),
)(Unconnected);
