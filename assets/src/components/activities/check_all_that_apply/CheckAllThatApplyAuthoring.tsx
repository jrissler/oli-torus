import React from 'react';
import ReactDOM from 'react-dom';
import { AuthoringElement, AuthoringElementProps } from '../AuthoringElement';
import { Navigation } from 'components/common/navigation';
import { CATASchema } from 'components/activities/check_all_that_apply/schema';
import { combineReducers } from '@reduxjs/toolkit';
import { Checkbox } from '../common/authoring/icons/checkbox/Checkbox';
import { choicesSlice } from '../common/choices/authoring/slice';
import { Choices } from '../common/choices';
import { Hints } from '../common/hints';
import { stemSlice } from '../common/stem/authoring/slice';
import { Stem } from '../common/stem';
import { previewTextSlice } from '../common/authoring/preview_text/slice';
import { CheckAllThatApplySettings } from './components/settings';
import { transformationsSlice } from '../common/authoring/transformations/slice';
import { AnswerKey } from '../common/authoring/answerKey/simple';
import { Feedback } from '../common/feedback';
import { responseMappingSlice } from '../common/authoring/responseChoices/responseChoicesSlice';
import { ActivityProvider } from '../ActivityContext';
import { ModalDisplay } from 'components/modal/ModalDisplay';
import { ErrorBoundary } from 'components/common/ErrorBoundary';
import { partsSlice } from '../common/authoring/parts/slice';
import { Manifest } from 'data/content/activities/activity';
import { configureStore } from 'state/store';
import { Provider } from 'react-redux';

const appStore = configureStore();

// export type RootCataState = RootActivityState<CATASchema>;
export const cataReducer = combineReducers<CATASchema>({
  stem: stemSlice.reducer,
  choices: choicesSlice.reducer,
  authoring: combineReducers({
    parts: partsSlice.reducer,
    previewText: previewTextSlice.reducer,
    transformations: transformationsSlice.reducer,
    responseMappings: responseMappingSlice.reducer,
  }),
  // settings: settingsSlice.reducer,
});

const selectAnswerKey = (state: any) => {
  switch (state) {
    case 'simple':
      return <></>;
    case 'targeted_only':
      return (
        <>
          <Feedback.Authoring.Targeted.Connected partId="1" />
        </>
      );
    case 'partial_credit_only':
    case 'targeted_and_partial_credit':
    default:
      throw new Error();
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

        <Navigation.Tabbed.Tab label="Answer Key">
          <AnswerKey.Authoring.Simple.Connected partId="1" />
          <Feedback.Authoring.Simple.Connected partId="1" />
          {selectAnswerKey('targeted_only')}
        </Navigation.Tabbed.Tab>

        <Navigation.Tabbed.Tab label="Hints">
          <Hints.Authoring.Connected partId="1" />
        </Navigation.Tabbed.Tab>
        <CheckAllThatApplySettings />
      </Navigation.Tabbed.Tabs>
    </>
  );
};

export class CheckAllThatApplyAuthoring extends AuthoringElement<CATASchema> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<CATASchema>) {
    ReactDOM.render(
      <Provider store={appStore}>
        <ErrorBoundary>
          <ActivityProvider {...props} modelReducer={cataReducer}>
            <CheckAllThatApply />
          </ActivityProvider>
          <ModalDisplay />
        </ErrorBoundary>
      </Provider>,
      mountPoint,
    );
  }
}
// eslint-disable-next-line
const manifest = require('./manifest.json') as Manifest;
window.customElements.define(manifest.authoring.element, CheckAllThatApplyAuthoring);
