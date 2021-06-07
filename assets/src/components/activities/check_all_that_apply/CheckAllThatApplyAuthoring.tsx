import React, { Reducer, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AuthoringElement, AuthoringElementProps } from '../AuthoringElement';
import { connect, Provider, useSelector } from 'react-redux';
import { Panels } from 'components/activities/common/authoring/Panels';
import { CheckAllThatApplyModelSchemaV2 } from 'components/activities/check_all_that_apply/schema';
import { StemAuthoring } from '../common/stem/Stem';
import {
  Choice,
  ChoiceId,
  HasChoices,
  HasHints,
  HasParts,
  HasStem,
  HasTargetedFeedback,
  HasTransformations,
  HintId,
  isTargetedFeedbackEnabled,
  Manifest,
  Operation,
  Part,
  ResponseId,
  RichText,
  Stem,
  TargetedFeedbackDisabled,
  TargetedFeedbackEnabled,
} from '../types';
import { combineReducers, createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { configureStore as configureStore2 } from '@reduxjs/toolkit';
import { Checkbox } from '../common/authoring/icons/Checkbox';
import {
  getChoiceIds,
  getCorrectChoiceIds,
  TargetedFeedback,
  targetedFeedbackSlice,
} from '../common/authoring/feedback/TargetedFeedback';
import { AuthoringFeedback } from '../common/authoring/feedback/Feedback';
import { AuthoringHints } from '../common/authoring/Hints';
import { Settings } from '../common/authoring/settings/Settings';
import {
  getResponse,
  getTransformations,
  isShuffled,
  makeChoice,
  makeHint,
  makeStem,
  makeTransformation,
} from '../common/authoring/utils';
import { ChoicesAuthoring } from '../common/choices/Authoring';
import { AuthoringAnswerKey } from '../common/authoring/AnswerKey';

export const selectStem = (state: HasStem) => state.stem;
const initialState: Stem = makeStem('');
export const stemSlice = createSlice({
  name: 'stem',
  initialState,
  reducers: {
    set(state, action: PayloadAction<RichText>) {
      state.content = action.payload;
    },
  },
});

const Stem = connect(
  (state: HasStem) => ({ stem: state.stem }),
  (dispatch) => ({
    onStemChange: (text: RichText) => dispatch(stemSlice.actions.set(text)),
  }),
)(StemAuthoring);

export const choicesSlice = createSlice({
  name: 'choices',
  initialState: [] as Choice[],
  reducers: {
    // addChoice: choicesAdapter.addOne,
    // editChoices: choicesAdapter.setAll,
    // removeChoice: choicesAdapter.removeOne,
    // editChoiceContent: choicesAdapter.updateOne,
    addChoice(state) {
      state.push(makeChoice(''));
    },
    editChoiceContent(state, action: PayloadAction<{ id: ChoiceId; content: RichText }>) {
      const choice = state.find(({ id }) => id === action.payload.id);
      if (choice) {
        choice.content = action.payload.content;
      }
    },
    editChoices(state, action: PayloadAction<Choice[]>) {
      return action.payload;
    },
    removeChoice(state, action: PayloadAction<ChoiceId>) {
      return state.filter((c) => c.id !== action.payload);
    },
  },
});

const Choices = connect(
  (state: HasChoices) => ({ choices: state.choices }),
  (dispatch) => ({
    onAddChoice: () => dispatch(choicesSlice.actions.addChoice()),
    onEditChoiceContent: (id: ChoiceId, content: RichText) =>
      dispatch(choicesSlice.actions.editChoiceContent({ id, content })),
    onEditChoices: (choices: Choice[]) => dispatch(choicesSlice.actions.editChoices(choices)),
    onRemoveChoice: (id: ChoiceId) => dispatch(choicesSlice.actions.removeChoice(id)),
  }),
)(ChoicesAuthoring);

const answerKeySlice = createSlice({
  name: 'answerKey',
  initialState: { stem: makeStem(''), choices: [] as Choice[] },
  reducers: {
    toggleCorrectness(state, action: PayloadAction<ChoiceId>) {
      return state;
    },
  },
});

const AnswerKey = connect(
  (state: HasChoices & HasStem & HasTargetedFeedback) => ({
    stem: state.stem,
    choices: state.choices,
    correctChoiceIds: getCorrectChoiceIds(state),
  }),
  (dispatch) => ({
    onToggleCorrectness: (id: ChoiceId) => dispatch(answerKeySlice.actions.toggleCorrectness(id)),
  }),
)(AuthoringAnswerKey);

// The default getCorrectResponse and getIncorrectResponse only work
// for models with one part and one correct response + one catch-all incorrect
// response. If an activity type has a different model, the response finding strategies
// should be passed.

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {} as HasParts,
  reducers: {
    setResponseFeedback(state, action: PayloadAction<{ id: ResponseId; content: RichText }>) {
      getResponse(state, action.payload.id).feedback.content = action.payload.content;
    },
  },
});

const Feedback = connect(
  (state: HasParts) => {
    const getCorrectResponse = (model: HasParts) =>
      model.authoring.parts[0].responses.find((r) => r.score === 1);
    const getIncorrectResponse = (model: HasParts) =>
      model.authoring.parts[0].responses.find((r) => r.score === 0);

    return {
      correctResponse: getCorrectResponse(state),
      incorrectResponse: getIncorrectResponse(state),
    };
  },
  (dispatch) => ({
    onSetResponseFeedback: (id: ResponseId, content: RichText) =>
      dispatch(feedbackSlice.actions.setResponseFeedback({ id, content })),
  }),
)(AuthoringFeedback);

export const hintsSlice = createSlice({
  name: 'hints',
  initialState: [makeHint('')],
  reducers: {
    addHint(state) {
      const newHint = makeHint('');
      // new hints are always cognitive hints. they should be inserted
      // right before the bottomOut hint at the end of the list
      const bottomOutIndex = state.length - 1;
      state.splice(bottomOutIndex, 0, newHint);
    },
    editHintContent(state, action: PayloadAction<{ id: HintId; content: RichText }>) {
      const hint = state.find(({ id }) => id === action.payload.id);
      if (hint) {
        hint.content = action.payload.content;
      }
    },
    removeHint(state, action: PayloadAction<HintId>) {
      return state.filter((h) => h.id !== action.payload);
    },
  },
});

const Hints = connect(
  (state: HasHints) => ({
    hints: state.authoring.parts[0].hints,
  }),
  (dispatch) => ({
    onEditHintContent: (id: HintId, content: RichText) =>
      dispatch(hintsSlice.actions.editHintContent({ id, content })),
    onAddHint: () => dispatch(hintsSlice.actions.addHint()),
    onRemoveHint: (id: HintId) => dispatch(hintsSlice.actions.removeHint(id)),
  }),
)(AuthoringHints);

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

  /*
  {
    stem: Stem,
    choices: Choice[],

  }
  */

  const store = configureStore2<CheckAllThatApplyModelSchemaV2>({
    reducer: (state = props.model, action) => {
      return state;
    },

    // combineReducers<CheckAllThatApplyModelSchemaV2>({
    //   choices: choicesSlice.reducer,
    //   // activity: activitySlice.reducer,
    //   stem: stemSlice.reducer,
    //   authoring: (state = props.model.authoring, action) => ({
    //     ...state,
    //     previewText: previewTextSlice.reducer(state.previewText, action),
    //   }),

    // combineReducers<CheckAllThatApplyModelSchemaV2['authoring']>({
    //   feedback: feedbackSlice.reducer as any,
    //   parts: partsSlice.reducer,
    //   transformations: transformationsSlice.reducer,
    //   previewText: previewTextReducer.reducer,
    // }),
    // }),
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
            {/* <Stem.Authoring.Connected /> */}
            <Stem />
            <select style={{ width: 160, height: 61, marginLeft: 10 }} className="custom-select">
              <option selected>Checkboxes</option>
              <option value="1">Multiple Choice</option>
              <option value="2">Ordering</option>
              <option value="3">Short Answer</option>
            </select>
          </div>

          <Choices icon={<Checkbox.Unchecked />} />
        </Panels.Tab>

        <Panels.Tab label="Answer Key">
          <AnswerKey />
          {/* <TargetedFeedback> */}
          <Feedback />
          {/* </TargetedFeedback> */}
        </Panels.Tab>

        <Panels.Tab label="Hints">
          <Hints />
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
