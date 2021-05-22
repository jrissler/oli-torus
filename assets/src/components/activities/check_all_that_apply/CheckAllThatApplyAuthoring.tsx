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
import { isCorrectChoice } from 'components/activities/check_all_that_apply/utils';
import { getHints, isShuffled } from 'components/activities/common/authoring/utils';
import { defaultWriterContext } from 'data/content/writers/context';
import { Panels } from 'components/activities/common/authoring/Panels';
import { Settings } from 'components/activities/common/authoring/settings/Settings';
import { Checkbox } from 'components/activities/common/authoring/icons/Checkbox';
import { toggleAnswerChoiceShuffling } from 'components/activities/common/utils';
import { CheckAllThatApplyModelSchemaV2 } from 'components/activities/check_all_that_apply/schema';
import { toggleTargetedFeedback } from 'components/activities/common/authoring/actions/feedback';
import {
  previewTextReducer,
  usePreviewText,
} from 'components/activities/common/authoring/preview_text/usePreviewText';
import { Stem, stemReducer, useStem } from 'components/activities/common/authoring/stem/Stem';
import { Choices } from 'components/activities/common/authoring/choices/Choices';

const store = configureStore();

const CheckAllThatApply = () => {
  const { model, dispatch } = useAuthoringElementContext<CheckAllThatApplyModelSchemaV2>();
  const { setPreviewText } = usePreviewText();

  return (
    <>
      <Panels.Tabs>
        <Panels.Tab label="Question">
          <Stem.Authoring onStemChange={setPreviewText} />

          <Choices
            icon={<Checkbox.Unchecked />}
            // addChoice={() => {
            //   dispatch(addChoice());
            //   (document.activeElement as any)?.blur();
            // }}
          />
        </Panels.Tab>

        <Panels.Tab label="Answer Key">
          <Stem.Delivery stem={model.stem} context={defaultWriterContext()} />
          <Feedback
            isCorrect={isCorrectChoice}
            toggleCorrect={(choiceId: string) => dispatch(toggleChoiceCorrectness(choiceId))}
            onEditFeedback={(responseId, feedbackContent) =>
              dispatch(editResponseFeedback(responseId, feedbackContent))
            }
          >
            {/* {ActivityTypes.isTargetedFeedbackEnabled(model) && (
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
            )} */}
          </Feedback>
        </Panels.Tab>
        <Panels.Tab label="Hints">
          <Hints
            hints={getHints(model)}
            onAdd={() => dispatch(addHint())}
            onEdit={(id, content) => dispatch(editHint(id, content))}
            onRemove={(id) => dispatch(removeHint(id))}
          />
        </Panels.Tab>

        <Settings.Menu>
          <Settings.Setting
            isEnabled={isShuffled(model.authoring.transformations)}
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
