import { Dispatch } from '@reduxjs/toolkit';
import { RootActivityState } from 'components/activities/ActivityContext';
import { ChoiceId, RichText } from 'data/content/activities/activity';
import { HasChoices, IChoice, makeChoice } from 'data/content/activities/choice';
import { connect } from 'react-redux';
import { choicesSlice, selectAllChoices } from './slice';
import { Unconnected } from './Unconnected';

const mapStateToProps = (state: HasChoices) => ({
  choices: selectAllChoices(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addOne: () => dispatch(choicesSlice.actions.addOne(makeChoice(''))),
  updateOne: (id: ChoiceId, content: RichText) =>
    dispatch(choicesSlice.actions.updateOne({ id, changes: { content } })),
  setAll: (choices: IChoice[]) => dispatch(choicesSlice.actions.setAll(choices)),
  removeOne: (id: ChoiceId) => dispatch(choicesSlice.actions.removeOne(id)),
});

export const Connected = connect(mapStateToProps, mapDispatchToProps)(Unconnected);
