import React from 'react';
import ReactDOM from 'react-dom';
import { AuthoringElement, AuthoringElementProps } from '../AuthoringElement';
import { MCSchema } from './schema';
import { ModalDisplay } from 'components/modal/ModalDisplay';
import { connect, Provider } from 'react-redux';
import { configureStore } from 'state/store';
import produce from 'immer';
import { Stem } from '../common/stem';
import { MCActions } from './actions';
import { ChoiceId, Manifest, ResponseId } from 'data/content/activities/activity';
import { Choices } from '../common/choices';
import { combineReducers, Dispatch } from 'redux';
import { selectStem, stemSlice } from '../common/stem/authoring/slice';
import { choicesSlice, selectAllChoices } from '../common/choices/authoring/slice';
import { partsSlice } from '../common/authoring/parts/slice';
import { previewTextSlice } from '../common/authoring/preview_text/slice';
import { transformationsSlice } from '../common/authoring/transformations/slice';
import {
  HasResponseMappings,
  responseMappingSlice,
  selectResponseMappingsByPartId,
} from '../common/authoring/responseChoices/responseChoicesSlice';
import { ActivityProvider } from '../ActivityContext';
import { ErrorBoundary } from 'components/common/ErrorBoundary';
import { Navigation } from 'components/common/navigation';
import { AnswerKey } from '../common/authoring/answerKey/simple';
import { Radio } from '../common/authoring/icons/radio/Radio';
import { Feedback } from '../common/feedback';
import { Hints } from '../common/hints';
import { ID } from 'data/content/model';
import {HasChoices} from 'data/content/activities/choice';
import {HasStem} from 'data/content/activities/stem';

const appStore = configureStore();

export const mcReducer = combineReducers<MCSchema>({
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

const AnswerKeyMC = connect(
  (state: HasStem & HasChoices & HasResponseMappings, ownProps: { partId: ID }) => ({
    stem: selectStem(state),
    choices: selectAllChoices(state),
    correctResponseMapping: selectResponseMappingsByPartId(state, ownProps.partId).correct,
  }),
  (dispatch: Dispatch, ownProps: { partId: ID }) => ({
    onSelectChoiceId: (responseId: ResponseId) => (choiceId: ChoiceId) => {

      dispatch(
        responseMappingSlice.actions.toggleChoice({
          partId: ownProps.partId,
          choiceId,
          responseId,
        }),
      );
      // dispatch(
      //   // responsesSlice.actions.updateRulesForMapping({

      //   // })
      // )
    },
  }),
  (stateProps, dispatchProps) => ({
    stem: stateProps.stem,
    choices: stateProps.choices,
    selectedChoiceIds: stateProps.correctResponseMapping.choiceIds,
    onSelectChoiceId: dispatchProps.onSelectChoiceId(stateProps.correctResponseMapping.responseId),
    selectedIcon: <Radio.Checked />,
    unselectedIcon: <Radio.Unchecked />,
  }),
)(AnswerKey.Authoring.Simple.Unconnected);

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

const MultipleChoice: React.FC = () => {
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

          <Choices.Authoring.Connected icon={<Radio.Unchecked />} />
        </Navigation.Tabbed.Tab>

        <Navigation.Tabbed.Tab label="Answer Key">
          {/* <AnswerKey.Authoring.Simple.Connected partId="1" /> */}
          <AnswerKeyMC partId="1" />
          <Feedback.Authoring.Simple.Connected partId="1" />
          {selectAnswerKey('targeted_only')}
        </Navigation.Tabbed.Tab>

        <Navigation.Tabbed.Tab label="Hints">
          <Hints.Authoring.Connected partId="1" />
        </Navigation.Tabbed.Tab>
        {/* <CheckAllThatApplySettings /> */}
      </Navigation.Tabbed.Tabs>
    </>
  );
};

export class MultipleChoiceAuthoring extends AuthoringElement<MCSchema> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<MCSchema>) {
    ReactDOM.render(
      <Provider store={appStore}>
        <ErrorBoundary>
          <ActivityProvider {...props} modelReducer={mcReducer}>
            <MultipleChoice />
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
window.customElements.define(manifest.authoring.element, MultipleChoiceAuthoring);
