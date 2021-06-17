import { selectAllChoices } from 'components/activities/common/choices/authoring/slice';
import { selectStem } from 'components/activities/common/stem/authoring/slice';
import { ChoiceId, ResponseId } from 'components/activities/types';
import { ID } from 'data/content/model';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  HasResponseMappings,
  responseMappingSlice,
  selectResponseMappingsByPartId,
} from '../../responseChoices/responseChoicesSlice';
import { Unconnected } from './Unconnected';

export const Connected = connect(
  (state: HasResponseMappings, ownProps: { partId: ID }) => ({
    stem: selectStem(state),
    choices: selectAllChoices(state),
    correctResponseMapping: selectResponseMappingsByPartId(state, ownProps.partId).correct,
  }),
  (dispatch: Dispatch, ownProps: { partId: ID }) => ({
    onSelectChoiceId: (responseId: ResponseId) => (id: ChoiceId) =>
      dispatch(
        responseMappingSlice.actions.toggleChoice({
          partId: ownProps.partId,
          choiceId: id,
          responseId: responseId,
        }),
      ),
  }),
  (stateProps, dispatchProps) => ({
    stem: stateProps.stem,
    choices: stateProps.choices,
    selectedChoiceIds: stateProps.correctResponseMapping.choiceIds,
    onSelectChoiceId: dispatchProps.onSelectChoiceId(stateProps.correctResponseMapping.responseId),
  }),
)(Unconnected);
