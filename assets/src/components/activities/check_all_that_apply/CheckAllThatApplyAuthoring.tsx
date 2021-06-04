import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { AuthoringElement, AuthoringElementProps } from '../AuthoringElement';
import { CheckAllThatApplyModelSchema } from './schema_old';
import { Feedback } from '../common/authoring/feedback/Feedback';
import { Hints } from '../common/authoring/Hints';
import { ModalDisplay } from 'components/modal/ModalDisplay';
import { Provider, useDispatch, useStore } from 'react-redux';
import { configureStore } from 'state/store';
import { getTransformations, isShuffled } from 'components/activities/common/authoring/utils';
import { Panels } from 'components/activities/common/authoring/Panels';
import { Settings } from 'components/activities/common/authoring/settings/Settings';
import { Checkbox } from 'components/activities/common/authoring/icons/Checkbox';
import { toggleAnswerChoiceShuffling } from 'components/activities/common/utils';
import { CheckAllThatApplyModelSchemaV2 } from 'components/activities/check_all_that_apply/schema';
import { toggleTargetedFeedback } from 'components/activities/common/authoring/actions/feedback';
import { usePreviewText } from 'components/activities/common/authoring/preview_text/usePreviewText';
import { Stem } from '../common/stem/Stem';
import { AnswerKey } from '../common/authoring/AnswerKey';
import { Choices } from '../common/choices';
import { useChoices } from 'components/activities/common/choices/Authoring';
import { isTargetedFeedbackEnabled, Manifest, RichText } from '../types';
import {
  getCorrectChoiceIds,
  TargetedFeedback,
} from '../common/authoring/feedback/TargetedFeedback';

import { combineReducers, createStore, PayloadAction } from '@reduxjs/toolkit';
import { stemSlice } from 'components/activities/common/stem/redux';
import { ActivityEditorProps } from 'components/activity/ActivityEditor';
import { Reducer } from 'react';

// export const { select: selectStemActionCreator } = stemSlice.actions;

// const activityStore = configureStore({ reducer: activityReducer });
// export { activityReducer, activityStore };

const store = configureStore();

// const useCheckAllThatApply = () => {
//   // const { model, onEdit } = useActivityContext<CheckAllThatApplyModelSchemaV2>();
//   // const store = useStore();
//   // console.log('store', store.getState());
//   // store.subscribe(() => {
//   //   console.log('state', store.getState());
//   //   onEdit(store.getState());
//   // });
//   const { setPreviewText } = usePreviewText();
//   // const { setStem } = useStem();
//   const { addChoice } = useChoices();
//   const dispatch = useDispatch();

//   return {
//     // setStem(text),
//     // stemChange: (text: RichText) => dispatch(setPreviewText(text)),
//     stemChange: (text: RichText) => dispatch(stemSlice.actions.set(text)),
//     // focus last choice and support targeted feedback in add choice
//     addChoice: () => dispatch(addChoice()),
//     toggleAnswerChoiceShuffling: () => dispatch(toggleAnswerChoiceShuffling()),
//     toggleTargetedFeedback: () => dispatch(toggleTargetedFeedback()),
//     // model,
//   };
// };

export const ActivityContext: React.Context<
  IActivityContext<CheckAllThatApplyModelSchemaV2> | undefined
> = React.createContext<IActivityContext<CheckAllThatApplyModelSchemaV2> | undefined>(undefined);

export function useActivityContext() {
  const context =
    useContext<IActivityContext<CheckAllThatApplyModelSchemaV2> | undefined>(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivityContext must be used within an ActivityProvider');
  }
  return context;
}

interface IActivityContext<ModelT> extends IActivityProviderProps<ModelT> {
  dispatch: React.Dispatch<PayloadAction>;
}
interface IActivityProviderProps<ModelT> extends AuthoringElementProps<ModelT> {
  reducer: React.Reducer<ModelT, PayloadAction>;
}

// const cataReducer = combineReducers({});

const activityReducer = combineReducers(stemSlice.reducer);

// export const ActivityProvider<ModelT>(props: IActivityProviderProps<ModelT>) {
export const ActivityProvider: React.FC<IActivityProviderProps<CheckAllThatApplyModelSchemaV2>> = (
  props,
) => {
  const [model, dispatch] = React.useReducer(props.reducer, props.model);
  return (
    <ActivityContext.Provider value={{ ...props, dispatch, model }}>
      {props.children}
    </ActivityContext.Provider>
  );
};

const CheckAllThatApply: React.FC = () => {
  // const { model, stemChange, addChoice, toggleAnswerChoiceShuffling, toggleTargetedFeedback } =
  // useCheckAllThatApply();
  const { model, dispatch } = useActivityContext();

  return (
    <>
      <Panels.Tabs>
        <Panels.Tab label="Question">
          <div className="d-flex">
            {/* <Stem.Authoring onStemChange={stemChange} /> */}
            <Stem.Authoring />
            <select style={{ width: 160, height: 61, marginLeft: 10 }} className="custom-select">
              <option selected>Checkboxes</option>
              <option value="1">Multiple Choice</option>
              <option value="2">Ordering</option>
              <option value="3">Short Answer</option>
            </select>
          </div>

          {/* <Choices.Authoring icon={<Checkbox.Unchecked />} onAddChoice={addChoice} /> */}
        </Panels.Tab>

        {/* <Panels.Tab label="Answer Key">
          <AnswerKey correctChoiceIds={getCorrectChoiceIds(model)} />
          <TargetedFeedback>
            <Feedback.Authoring />
          </TargetedFeedback>
        </Panels.Tab>

        <Panels.Tab label="Hints">
          <Hints />
        </Panels.Tab> */}

        {/* <Settings.Menu>
          <Settings.Setting
            isEnabled={isShuffled(getTransformations(model))}
            onToggle={toggleAnswerChoiceShuffling}
          >
            Shuffle answer choice order
          </Settings.Setting>
          <Settings.Setting
            isEnabled={isTargetedFeedbackEnabled(model)}
            onToggle={toggleTargetedFeedback}
          >
            Targeted Feedback
          </Settings.Setting>
        </Settings.Menu> */}
      </Panels.Tabs>
    </>
  );
};

export class CheckAllThatApplyAuthoring extends AuthoringElement<CheckAllThatApplyModelSchemaV2> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<CheckAllThatApplyModelSchemaV2>) {
    ReactDOM.render(
      <Provider store={store}>
        {/* <ActivityProvider reducer={cataReducer} value={props}> */}
        {/* <Provider store={activityStore}> */}
        <ActivityProvider {...props} reducer={activityReducer}>
          <CheckAllThatApply />
        </ActivityProvider>
        {/* </Provider> */}
        {/* </ActivityProvider> */}
        <ModalDisplay />
      </Provider>,
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
