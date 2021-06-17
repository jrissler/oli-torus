import { connect } from 'react-redux';
import { getTransformations, isShuffled } from 'components/activities/common/authoring/utils';
import { createAction } from '@reduxjs/toolkit';
import {
  CheckAllThatApplySettingsComponent,
  Setting,
} from 'components/activities/common/authoring/settings/setting/main';
import { HasTransformations } from 'components/activities/common/authoring/transformations/types';
import { HasTargetedFeedback } from 'components/activities/common/feedback/targeted/types';
import { selectAllTransformations } from 'components/activities/common/authoring/transformations/slice';
import { CataRootState } from '../CheckAllThatApplyAuthoring';

const toggleAnswerChoiceShuffling = createAction<void>('settings/toggleAnswerChoiceShuffling');
const toggleTargetedFeedback = createAction<void>('settings/toggleTargetedFeedback');
export const CheckAllThatApplySettings = connect(
  (state: CataRootState) => ({
    settingsState: [
      {
        isEnabled: isShuffled(selectAllTransformations(state)),
        label: 'Shuffle answer choice order',
      },
      {
        // isEnabled: isTargetedFeedbackEnabled(state),
        isEnabled: true,
        label: 'Targeted feedback',
      },
      {
        isEnabled: true,
        label: 'Partial credit',
      },
    ],
  }),
  (dispatch) => ({
    settingsDispatch: [
      { onToggle: () => dispatch(toggleAnswerChoiceShuffling()) },
      { onToggle: () => dispatch(toggleTargetedFeedback()) },
      { onToggle: () => undefined },
    ],
  }),
  (stateProps, dispatchProps) => ({
    // zip both lists together into a single list of Setting objects
    settings: stateProps.settingsState.reduce(
      (acc, settingsState, i) =>
        acc.concat({ ...settingsState, ...dispatchProps.settingsDispatch[i] }),
      [] as Setting[],
    ),
  }),
)(CheckAllThatApplySettingsComponent);
