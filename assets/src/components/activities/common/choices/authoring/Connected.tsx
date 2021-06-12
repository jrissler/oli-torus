import { createSelector } from '@reduxjs/toolkit';
import { ChoiceId, RichText } from 'components/activities/types';
import { connect } from 'react-redux';
import { makeChoice } from '../../authoring/utils';
import { HasChoices, IChoice } from '../types';
import { choicesSlice } from './slice';
import { Unconnected } from './Unconnected';

export const selectChoices = createSelector(
  (state: HasChoices) => state.choices,
  (choices) => ({ choices }),
);

export const Connected = connect(selectChoices, (dispatch) => ({
  addOne: () => dispatch(choicesSlice.actions.addOne(makeChoice(''))),
  updateOne: (id: ChoiceId, content: RichText) =>
    dispatch(choicesSlice.actions.updateOne({ id, changes: { content } })),
  setAll: (choices: IChoice[]) => dispatch(choicesSlice.actions.setAll(choices)),
  removeOne: (id: ChoiceId) => dispatch(choicesSlice.actions.removeOne(id)),
}))(Unconnected);
