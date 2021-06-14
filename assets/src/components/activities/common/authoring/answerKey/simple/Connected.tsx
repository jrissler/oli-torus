import { HasChoices } from 'components/activities/common/choices/types';
import { HasStem } from 'components/activities/common/stem/types';
import { ChoiceId } from 'components/activities/types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { HasParts } from '../../parts/types';
import {
  HasResponseMappings,
  selectCorrectResponseMapping,
  TargetedResponseMapping,
} from '../../responseChoices/responseChoicesSlice';
import { toggleAnswerChoice } from './slice';
import { Unconnected } from './Unconnected';

const mapStateToProps = (state: HasChoices & HasStem & HasParts & HasResponseMappings) => ({
  stem: state.stem,
  choices: state.choices,
  correctResponseMapping: selectCorrectResponseMapping(state),
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSelectChoiceId: (mapping: TargetedResponseMapping) => (id: ChoiceId) =>
    dispatch(toggleAnswerChoice({ id, responseMapping: mapping })),
});

export const Connected = connect(
  mapStateToProps,
  mapDispatchToProps,
  (stateProps, dispatchProps) => ({
    stem: stateProps.stem,
    choices: stateProps.choices,
    selectedChoiceIds: stateProps.correctResponseMapping.choiceIds,
    onSelectChoiceId: dispatchProps.onSelectChoiceId(stateProps.correctResponseMapping),
  }),
)(Unconnected);
