import { createSelector } from '@reduxjs/toolkit';
import { CataRootState } from 'components/activities/check_all_that_apply/CheckAllThatApplyAuthoring';
import { RichText } from 'components/activities/types';
import { connect } from 'react-redux';
import { HasStem } from '../types';
import { selectStem, stemSlice } from './slice';
import { Unconnected } from './Unconnected';

export const Connected = connect(
  (state: CataRootState) => ({ stem: selectStem(state) }),
  (dispatch) => ({
    update: (content: RichText) => dispatch(stemSlice.actions.update({ changes: { content } })),
  }),
)(Unconnected);
