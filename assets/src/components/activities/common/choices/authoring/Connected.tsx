import { createSelector, Dispatch } from '@reduxjs/toolkit';
import { CataRootState } from 'components/activities/check_all_that_apply/CheckAllThatApplyAuthoring';
import { ChoiceId, RichText } from 'components/activities/types';
import { connect, MapDispatchToProps } from 'react-redux';
import { HasChoices, IChoice, makeChoice } from '../types';
import { choicesSlice, selectAllChoices } from './slice';
import { Unconnected } from './Unconnected';

const mapStateToProps = (state: CataRootState) => ({ choices: state.choices });
// const mapStateToProps = (state: any) => ({ choices: state.choices });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addOne: () => dispatch(choicesSlice.actions.addOne(makeChoice(''))),
  updateOne: (id: ChoiceId, content: RichText) =>
    dispatch(choicesSlice.actions.updateOne({ id, changes: { content } })),
  setAll: (choices: IChoice[]) => dispatch(choicesSlice.actions.setAll(choices)),
  removeOne: (id: ChoiceId) => dispatch(choicesSlice.actions.removeOne(id)),
});

export const Connected = connect(mapStateToProps, mapDispatchToProps)(Unconnected);
