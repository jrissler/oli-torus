import { createSelector } from '@reduxjs/toolkit';
import { RootActivityState } from 'components/activities/ActivityContext';
import { RichText } from 'data/content/activities/activity';
import { HasStem } from 'data/content/activities/stem';
import { connect } from 'react-redux';
import { selectStem, stemSlice } from './slice';
import { Unconnected } from './Unconnected';

export const Connected = connect(
  (state: HasStem) => ({ stem: selectStem(state) }),
  (dispatch) => ({
    update: (content: RichText) => dispatch(stemSlice.actions.update({ changes: { content } })),
  }),
)(Unconnected);
