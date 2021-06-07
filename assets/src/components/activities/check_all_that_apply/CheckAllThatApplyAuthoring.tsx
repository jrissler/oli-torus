import React, { Reducer, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AuthoringElement, AuthoringElementProps } from '../AuthoringElement';
import { connect, Provider, useSelector } from 'react-redux';
import { Panels } from 'components/activities/common/authoring/Panels';
import { CheckAllThatApplyModelSchemaV2 } from 'components/activities/check_all_that_apply/schema';
import { Stem, stemSlice } from '../common/stem/Stem';
import {
  HasTargetedFeedback,
  HasTransformations,
  isTargetedFeedbackEnabled,
  Manifest,
  Operation,
  Part,
  TargetedFeedbackDisabled,
  TargetedFeedbackEnabled,
} from '../types';
import { combineReducers, createAction, createSlice } from '@reduxjs/toolkit';
import { configureStore as configureStore2 } from '@reduxjs/toolkit';
import { Choices } from '../common/choices';
import { Checkbox } from '../common/authoring/icons/Checkbox';
import { choicesSlice } from '../common/choices/Authoring';
import { AnswerKey, answerKeySlice } from '../common/authoring/AnswerKey';
import {
  getChoiceIds,
  TargetedFeedback,
  targetedFeedbackSlice,
} from '../common/authoring/feedback/TargetedFeedback';
import { Feedback } from '../common/authoring/feedback/Feedback';
import { Hints } from '../common/authoring/Hints';
import { Settings } from '../common/authoring/settings/Settings';
import { getTransformations, isShuffled, makeTransformation } from '../common/authoring/utils';
import { transformationsSlice } from '../common/authoring/transformations/transformationsRedux';
import { previewTextSlice } from '../common/authoring/preview_text/previewTextRedux';

export const ActivityContext: React.Context<
  AuthoringElementProps<CheckAllThatApplyModelSchemaV2> | undefined
> =
  React.createContext<AuthoringElementProps<CheckAllThatApplyModelSchemaV2> | undefined>(undefined);

export function useActivityContext() {
  const context =
    useContext<AuthoringElementProps<CheckAllThatApplyModelSchemaV2> | undefined>(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivityContext must be used within an ActivityProvider');
  }
  return context;
}

function removeFromList<T>(item: T, list: T[]) {
  const index = list.findIndex((x) => x === item);
  if (index > -1) {
    list.splice(index, 1);
  }
  return list;
}
function addOrRemoveFromList<T>(item: T, list: T[]) {
  if (list.find((x) => x === item)) {
    return removeFromList(item, list);
  }
  list.push(item);
  return list;
}

const toggleAnswerChoiceShuffling = createAction<void>('settings/toggleAnswerChoiceShuffling');
const toggleTargetedFeedback = createAction<void>('settings/toggleTargetedFeedback');
type Setting = { isEnabled: boolean; onToggle: () => void; label: string };
const CheckAllThatApplySettingsComponent: React.FC<{
  settings: Setting[];
}> = ({ settings }) => {
  return (
    <Settings.Menu>
      {settings.map(({ isEnabled, onToggle, label }, i) => (
        <Settings.Setting key={i} isEnabled={isEnabled} onToggle={onToggle}>
          {label}
        </Settings.Setting>
      ))}
    </Settings.Menu>
  );
};
const CheckAllThatApplySettings = connect(
  (state: HasTransformations & HasTargetedFeedback) => ({
    settingsState: [
      {
        isEnabled: isShuffled(getTransformations(state)),
        label: 'Shuffle answer choice order',
      },
      {
        isEnabled: isTargetedFeedbackEnabled(state),
        label: 'Targeted Feedback',
      },
    ],
  }),
  (dispatch) => ({
    settingsDispatch: [
      { onToggle: () => dispatch(toggleAnswerChoiceShuffling()) },
      { onToggle: () => dispatch(toggleTargetedFeedback()) },
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

export const ActivityProvider: React.FC<AuthoringElementProps<CheckAllThatApplyModelSchemaV2>> = (
  props,
) => {
  const activitySlice = createSlice({
    name: 'model',
    initialState: props.model,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(answerKeySlice.actions.toggleCorrectness, (state, action) => {
          const correct = addOrRemoveFromList(
            action.payload,
            getChoiceIds(state.authoring.feedback.correct),
          );
          const incorrect = addOrRemoveFromList(
            action.payload,
            getChoiceIds(state.authoring.feedback.incorrect),
          );
          targetedFeedbackSlice.reducer(
            state,
            targetedFeedbackSlice.actions.syncResponseRules({
              correctChoiceIds: correct,
              incorrectChoiceIds: incorrect,
            }),
          );
        })
        .addCase(toggleTargetedFeedback, (state) => {
          if (state.authoring.feedback.type === 'TargetedFeedbackEnabled') {
            (state as TargetedFeedbackDisabled).authoring.feedback.type =
              'TargetedFeedbackDisabled';
          } else {
            (state as TargetedFeedbackEnabled).authoring.feedback.type = 'TargetedFeedbackEnabled';
          }
        });
    },
  });

  const partsSlice = createSlice({
    name: 'parts',
    reducers: {},
    initialState: {} as CheckAllThatApplyModelSchemaV2['authoring']['parts'],
  });
  const feedbackSlice = createSlice({
    name: 'feedback',
    reducers: {},
    initialState: {} as HasTargetedFeedback['authoring']['feedback'],
  });

  const store = configureStore2<CheckAllThatApplyModelSchemaV2>({
    reducer: combineReducers<CheckAllThatApplyModelSchemaV2>({
      choices: choicesSlice.reducer,
      // activity: activitySlice.reducer,
      stem: stemSlice.reducer,
      authoring: (state = props.model.authoring, action) => ({
        ...state,
        previewText: previewTextSlice.reducer(state.previewText, action),
      }),

      // combineReducers<CheckAllThatApplyModelSchemaV2['authoring']>({
      //   feedback: feedbackSlice.reducer as any,
      //   parts: partsSlice.reducer,
      //   transformations: transformationsSlice.reducer,
      //   previewText: previewTextReducer.reducer,
      // }),
    }),
    // (state = props.model, action) => {
    // return activitySlice.reducer(
    //   {
    //     ...state,
    //     stem: stemSlice.reducer(state?.stem, action),
    //     choices: choicesSlice.reducer(state?.choices, action),
    //   },
    //   action,
    // );
    preloadedState: props.model,
  });
  store.subscribe(() => props.onEdit(store.getState()));

  return (
    <Provider store={store}>
      <ActivityContext.Provider value={{ ...props }}>{props.children}</ActivityContext.Provider>
    </Provider>
  );
};

const CheckAllThatApply: React.FC = () => {
  return (
    <>
      <Panels.Tabs>
        <Panels.Tab label="Question">
          <div className="d-flex">
            <Stem.Authoring.Connected />
            <select style={{ width: 160, height: 61, marginLeft: 10 }} className="custom-select">
              <option selected>Checkboxes</option>
              <option value="1">Multiple Choice</option>
              <option value="2">Ordering</option>
              <option value="3">Short Answer</option>
            </select>
          </div>

          <Choices.Authoring icon={<Checkbox.Unchecked />} />
        </Panels.Tab>

        <Panels.Tab label="Answer Key">
          <AnswerKey.Connected />
          {/* <TargetedFeedback> */}
          <Feedback.Authoring.Connected />
          {/* </TargetedFeedback> */}
        </Panels.Tab>

        <Panels.Tab label="Hints">
          <Hints.Connected />
        </Panels.Tab>
        <CheckAllThatApplySettings />
      </Panels.Tabs>
    </>
  );
};

export class CheckAllThatApplyAuthoring extends AuthoringElement<CheckAllThatApplyModelSchemaV2> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<CheckAllThatApplyModelSchemaV2>) {
    ReactDOM.render(
      <>
        {/* <AuthoringElementContext.Provider value={props}> */}
        <ActivityProvider {...props}>
          <CheckAllThatApply />
          {/* </Provider> */}
        </ActivityProvider>
        {/* </AuthoringElementContext.Provider> */}
      </>,
      mountPoint,
    );
  }
}
// eslint-disable-next-line
const manifest = require('./manifest.json') as Manifest;
window.customElements.define(manifest.authoring.element, CheckAllThatApplyAuthoring);

{
  /* {ActivityTypes.isTargetedFeedbackEnabled(model) && (
              <TargetedFeedback
                model={model}
                onEditFeedback={(responseId, feedbackContent) =>
                  dispatch(editResponseFeedback(responseId, feedbackContent))
                }
                onAddTargetedFeedback={() => dispatch(addTargetedFeedback())}
                onRemoveTargetedFeedback={(responseId: ActivityTypes.ResponseId) =>
                  dispatch(removeTargetedFeedback(responseId))
                }
                onEditTargetedFeedbackChoices={(
                  responseId: ActivityTypes.ResponseId,
                  choiceIds: ActivityTypes.ChoiceId[],
                ) => dispatch(editTargetedFeedbackChoices(responseId, choiceIds))}
              />
            )} */
}
