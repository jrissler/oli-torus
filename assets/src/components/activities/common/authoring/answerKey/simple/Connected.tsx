import { RootActivityState } from 'components/activities/ActivityContext';
import { selectAllChoices } from 'components/activities/common/choices/authoring/slice';
import { selectStem } from 'components/activities/common/stem/authoring/slice';
import { ChoiceId, ResponseId } from 'data/content/activities/activity';
import { ID } from 'data/content/model';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  HasResponseMappings,
  responseMappingSlice,
  selectResponseMappingsByPartId,
  toggleChoice,
} from '../../responseChoices/responseChoicesSlice';
import { responsesSlice } from '../../responses/slice';
import { Unconnected } from './Unconnected';
import React from 'react';
import { Checkbox } from '../../icons/checkbox/Checkbox';
import { HasStem } from 'data/content/activities/stem';
import { HasChoices } from 'data/content/activities/choice';

export const Connected = connect(
  (state: HasStem & HasChoices & HasResponseMappings, ownProps: { partId: ID }) => ({
    stem: selectStem(state),
    choices: selectAllChoices(state),
    correctResponseMapping: selectResponseMappingsByPartId(state, ownProps.partId).correct,
  }),
  (dispatch, ownProps: { partId: ID }) => ({
    onSelectChoiceId: (responseId: ResponseId) => (choiceId: ChoiceId) => {
      dispatch(
        toggleChoice({
          partId: ownProps.partId,
          choiceId,
          responseId,
        }) as any,
      );
    },
  }),
  (stateProps, dispatchProps) => ({
    stem: stateProps.stem,
    choices: stateProps.choices,
    selectedChoiceIds: stateProps.correctResponseMapping.choiceIds,
    onSelectChoiceId: dispatchProps.onSelectChoiceId(stateProps.correctResponseMapping.responseId),
    selectedIcon: <Checkbox.Checked />,
    unselectedIcon: <Checkbox.Unchecked />,
  }),
)(Unconnected);
