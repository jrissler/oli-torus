import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { AuthoringElement, AuthoringElementProps } from '../AuthoringElement';
import { Provider } from 'react-redux';
import { Navigation } from 'components/common/navigation';
import { CATASchema } from 'components/activities/check_all_that_apply/schema';
import { Manifest } from '../types';
import { combineReducers } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { Checkbox } from '../common/authoring/icons/Checkbox';
import { choicesSlice } from '../common/choices/authoring/slice';
import { Choices } from '../common/choices';
import { Hints } from '../common/hints';
import { stemSlice } from '../common/stem/authoring/slice';
import { Stem } from '../common/stem';
import { previewTextSlice } from '../common/authoring/preview_text/slice';
import { partsSlice } from '../common/authoring/parts/slice';
import { CheckAllThatApplySettings } from './components/settings';
import { transformationsSlice } from '../common/authoring/transformations/slice';
import { AnswerKey } from '../common/authoring/answerKey/simple';
import { Feedback } from '../common/feedback';
import { settings } from 'nprogress';
import { responseMappingSlice } from '../common/authoring/responseChoices/responseChoicesSlice';

export const ActivityContext: React.Context<AuthoringElementProps<CATASchema> | undefined> =
  React.createContext<AuthoringElementProps<CATASchema> | undefined>(undefined);

export function useActivityContext() {
  const context = useContext<AuthoringElementProps<CATASchema> | undefined>(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivityContext must be used within an ActivityProvider');
  }
  return context;
}

const cataReducer = combineReducers({
  [stemSlice.name]: stemSlice.reducer,
  [choicesSlice.name]: choicesSlice.reducer,
  authoring: combineReducers({
    [partsSlice.name]: partsSlice.reducer,
    [previewTextSlice.name]: previewTextSlice.reducer,
    [transformationsSlice.name]: transformationsSlice.reducer,
    responseMappings: responseMappingSlice.reducer,
    // settings: settingsSlice.reducer,
  }),
});
export type CataRootState = ReturnType<typeof cataReducer>;

export const ActivityProvider: React.FC<AuthoringElementProps<CATASchema>> = (props) => {
  const store = configureStore({
    // The UI state is coupled to the model state. This could be refactored
    // to normalize out the entity relationships in the model, but since every
    // edit creates and pushes out a complete new model, the choice was made to keep the
    // state coupled and prevent a normalize/denormalize step on every model change.
    reducer: cataReducer,
    preloadedState: props.model,
  });

  console.log('initial store state', store.getState());

  store.subscribe(() => {
    console.log('about to call onEdit with state', store.getState());
    props.onEdit(store.getState());
  });
  return (
    <Provider store={store}>
      <ActivityContext.Provider value={{ ...props }}>{props.children}</ActivityContext.Provider>
    </Provider>
  );
};

const selectAnswerKey = (state: any) => {
  switch (state) {
    case 'simple':
    case 'targeted_only':
    case 'partial_credit_only':
    case 'targeted_and_partial_credit':
    default:
      return (
        <>
          <AnswerKey.Authoring.Simple.Connected />
          <Feedback.Authoring.Simple.Connected />
        </>
      );
  }
};

const CheckAllThatApply: React.FC = () => {
  return (
    <>
      <Navigation.Tabbed.Tabs>
        <Navigation.Tabbed.Tab label="Question">
          <div className="d-flex">
            <Stem.Authoring.Connected />
            <select style={{ width: 160, height: 61, marginLeft: 10 }} className="custom-select">
              <option selected>Checkboxes</option>
              <option value="1">Multiple Choice</option>
              <option value="2">Ordering</option>
              <option value="3">Short Answer</option>
            </select>
          </div>

          <Choices.Authoring.Connected icon={<Checkbox.Unchecked />} />
        </Navigation.Tabbed.Tab>

        {/*
          Targeted Feedback + Partial Credit

            MAIN COMPONENT: (Call answer key)
            Stem.Delivery | Max Points (Also show in answer key as label)
            Answer Choices

            Card
              "Feedback for this selection" | Points
              Answer Choices
              Feedback box

            Card
              "Feedback for incorrect answers"
              Feedback Box


          Targeted Feedback (no partial credit)

            Stem.Delivery
            Answer Choices

            Card
              "Feedback for correct answer" | Points
              Feedback box

            Card
              "Feedback for incorrect answers"
              Feedback Box

            Card
              "Feedback for this selection"
              Answer Choices
              Feedback box

            Add targeted feedback button

          No targeted feedback, no partial credit
            Answer Key -> selecting an answer

            Card
              "Feedback for correct answer" | Points
              Feedback box

            Card
              "Feedback for incorrect answers"
              Feedback Box


          Need:
            choicesResponses mapping
            actions:
              no targeted feedback, no partial credit:
                toggle answer choice ->
                  add or remove choice id from correct response mapping
                  add or remove choice id from incorrect response mapping
                  update correct response rule (needs choice id mappings)
                  update incorrect response rule (needs choice id mappings)
              targeted feedback, no partial credit:
                toggle answer choice ->



        */}

        <Navigation.Tabbed.Tab label="Answer Key">
          {selectAnswerKey('none')}
          {/* <Feedback.Authoring.Targeted.Connected /> */}
        </Navigation.Tabbed.Tab>

        <Navigation.Tabbed.Tab label="Hints">
          <Hints.Authoring.Connected />
        </Navigation.Tabbed.Tab>
        <CheckAllThatApplySettings />
      </Navigation.Tabbed.Tabs>
    </>
  );
};

export class CheckAllThatApplyAuthoring extends AuthoringElement<CATASchema> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<CATASchema>) {
    ReactDOM.render(
      <ActivityProvider {...props}>
        <CheckAllThatApply />
      </ActivityProvider>,
      mountPoint,
    );
  }
}
// eslint-disable-next-line
const manifest = require('./manifest.json') as Manifest;
window.customElements.define(manifest.authoring.element, CheckAllThatApplyAuthoring);

{
  /* <AuthoringElementContext.Provider value={props}> */
}
{
  /* </AuthoringElementContext.Provider> */
}
