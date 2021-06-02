import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  AuthoringElement,
  AuthoringElementContext,
  AuthoringElementProps,
  useAuthoringElementContext,
} from '../AuthoringElement';
import { CheckAllThatApplyModelSchema } from './schema_old';
import * as ActivityTypes from '../types';
import { Feedback } from '../common/authoring/feedback/Feedback';
import { Hints } from '../common/authoring/Hints';
import { ModalDisplay } from 'components/modal/ModalDisplay';
import { Provider } from 'react-redux';
import { configureStore } from 'state/store';
import {
  getCorrectChoiceIds,
  isCorrectChoice,
} from 'components/activities/check_all_that_apply/utils';
import {
  getHints,
  getTransformations,
  isShuffled,
} from 'components/activities/common/authoring/utils';
import { defaultWriterContext } from 'data/content/writers/context';
import { Panels } from 'components/activities/common/authoring/Panels';
import { Settings } from 'components/activities/common/authoring/settings/Settings';
import { Checkbox } from 'components/activities/common/authoring/icons/Checkbox';
import { toggleAnswerChoiceShuffling } from 'components/activities/common/utils';
import { CheckAllThatApplyModelSchemaV2 } from 'components/activities/check_all_that_apply/schema';
import { toggleTargetedFeedback } from 'components/activities/common/authoring/actions/feedback';
import { usePreviewText } from 'components/activities/common/authoring/preview_text/usePreviewText';
// import { Stem, stemReducer, useStem } from 'components/activities/common/authoring/stem/Stem';
import produce from 'immer';
import { Stem, useStem } from '../common/stem/Stem';
import { AnswerKey } from '../common/authoring/AnswerKey';
import { Choices } from '../common/choices';
import { useChoices } from 'components/activities/common/choices/Authoring';

const store = configureStore();

const CheckAllThatApply = () => {
  // const { onEdit } = useAuthoringElementContext<CheckAllThatApplyModelSchemaV2>();
  // const dispatch = (action: (state: MultipleChoiceModelSchema) => void) =>
  //   props.onEdit(produce(props.model, action));

  const { previewText, setPreviewText } = usePreviewText();
  const { setStem } = useStem();
  const { model, dispatch } = useAuthoringElementContext<CheckAllThatApplyModelSchemaV2>();
  const { addChoice } = useChoices();

  return (
    <>
      {/* <div>{previewText}</div> */}
      <Panels.Tabs>
        <Panels.Tab label="Question">
          <div className="d-flex">
            <Stem.Authoring
              onStemChange={(text) => dispatch(setStem(text), setPreviewText(text))}
            />
            <select style={{ width: 160, height: 61, marginLeft: 10 }} className="custom-select">
              <option selected>Checkboxes</option>
              <option value="1">Multiple Choice</option>
              <option value="2">Ordering</option>
              <option value="3">Short Answer</option>
            </select>
          </div>

          <Choices.Authoring
            icon={<Checkbox.Unchecked />}
            onAddChoice={() => {
              dispatch(addChoice());
              // TODO: Focus last choice here
              (document.activeElement as any)?.blur();

              // Support targeted feedback here
            }}
          />
        </Panels.Tab>

        <Panels.Tab label="Answer Key">
          <AnswerKey correctChoiceIds={getCorrectChoiceIds(model)} />
          <Feedback.Authoring />
        </Panels.Tab>

        <Panels.Tab label="Hints">
          <Hints />
        </Panels.Tab>

        <Settings.Menu>
          <Settings.Setting
            isEnabled={isShuffled(getTransformations(model))}
            onToggle={() => dispatch(toggleAnswerChoiceShuffling())}
          >
            Shuffle answer choice order
          </Settings.Setting>
          <Settings.Setting
            isEnabled={ActivityTypes.isTargetedFeedbackEnabled(model)}
            onToggle={() => dispatch(toggleTargetedFeedback())}
          >
            Targeted Feedback
          </Settings.Setting>
        </Settings.Menu>
      </Panels.Tabs>
    </>
  );
};

export class CheckAllThatApplyAuthoring extends AuthoringElement<CheckAllThatApplyModelSchema> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<CheckAllThatApplyModelSchema>) {
    ReactDOM.render(
      <Provider store={store}>
        <AuthoringElementContext.Provider value={props}>
          <CheckAllThatApply />
        </AuthoringElementContext.Provider>
        <ModalDisplay />
      </Provider>,
      mountPoint,
    );
  }
}
// eslint-disable-next-line
const manifest = require('./manifest.json') as ActivityTypes.Manifest;
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
