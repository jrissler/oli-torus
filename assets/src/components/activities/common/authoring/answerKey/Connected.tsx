import { ChoiceId } from 'components/activities/types';
import { connect } from 'react-redux';
import { HasChoices } from '../../choices/types';
import { HasStem } from '../../stem/types';
import { answerKeySlice } from './slice';
import { Unconnected } from './Unconnected';

export const Connected = connect(
  (state: HasStem & HasChoices) => ({
    stem: state.stem,
    choices: state.choices,
  }),
  (dispatch) => ({
    onToggleCorrectness: (id: ChoiceId) => dispatch(answerKeySlice.actions.toggleCorrectness(id)),
  }),
)(Unconnected);
