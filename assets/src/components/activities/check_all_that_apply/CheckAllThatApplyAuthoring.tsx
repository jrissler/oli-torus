import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  AuthoringElement,
  AuthoringElementContext,
  AuthoringElementProps,
  useAuthoringElementContext,
} from '../AuthoringElement';
import { CheckAllThatApplyModelSchema } from './schema';
import * as ActivityTypes from '../types';
import { Stem } from '../common/authoring/Stem';
import { Feedback } from '../common/authoring/feedback/Feedback';
import { Hints } from '../common/authoring/Hints';
import { Actions } from './actions';
import { ModalDisplay } from 'components/modal/ModalDisplay';
import { Provider } from 'react-redux';
import { configureStore } from 'state/store';
import produce from 'immer';
import { TargetedFeedback } from 'components/activities/common/authoring/feedback/TargetedFeedback';
import { isCorrectChoice, isTargetedCATA } from 'components/activities/check_all_that_apply/utils';
import { getHints, isShuffled } from 'components/activities/common/authoring/utils';
import { MovableChoices } from 'components/activities/common/authoring/choices/MovableChoices';
import { Stem as DisplayedStem } from '../common/delivery/DisplayedStem';
import { defaultWriterContext } from 'data/content/writers/context';
import { Panels } from 'components/activities/common/authoring/Panels';
import { Settings } from 'components/activities/common/authoring/settings/Settings';
import { Checkbox } from 'components/activities/common/authoring/icons/Checkbox';

const store = configureStore();

const CheckAllThatApply = () => {
  const { model, onEdit } = useAuthoringElementContext<CheckAllThatApplyModelSchema>();

  const dispatch = (action: (model: CheckAllThatApplyModelSchema) => void) =>
    onEdit(produce(model, action));
  return (
    <>
      <Settings.Menu>
        <Settings.Setting
          isEnabled={isShuffled(model.authoring.transformations)}
          onToggle={() => dispatch(Actions.toggleAnswerChoiceShuffling())}
        >
          Shuffle answer choice order
        </Settings.Setting>
        <Settings.Setting
          isEnabled={isTargetedCATA(model)}
          onToggle={() => dispatch(Actions.toggleType())}
        >
          Targeted Feedback
        </Settings.Setting>
      </Settings.Menu>

      <Panels.Tabs>
        <Panels.Tab label="Question">
          <Stem stem={model.stem} onEdit={(content) => dispatch(Actions.editStem(content))} />

          <MovableChoices
            dispatch={dispatch}
            model={model}
            icon={<Checkbox.Unchecked />}
            choices={model.choices}
            onAdd={() => {
              dispatch(Actions.addChoice());
              (document.activeElement as any)?.blur();
            }}
            onEditContent={(id, content) => dispatch(Actions.editChoiceContent(id, content))}
            onRemove={(id) => dispatch(Actions.removeChoice(id))}
            // onMoveUp={(id) => dispatch(Actions.moveChoice('up', id))}
            // onMoveDown={(id) => dispatch(Actions.moveChoice('down', id))}
          />
        </Panels.Tab>
        <Panels.Tab label="Answer Key">
          <DisplayedStem stem={model.stem} context={defaultWriterContext()} />

          <Feedback
            isCorrect={isCorrectChoice}
            toggleCorrect={(choiceId: string) =>
              dispatch(Actions.toggleChoiceCorrectness(choiceId))
            }
            model={model}
            onEditFeedback={(responseId, feedbackContent) =>
              dispatch(Actions.editResponseFeedback(responseId, feedbackContent))
            }
          >
            {isTargetedCATA(model) && (
              <TargetedFeedback
                model={model}
                onEditFeedback={(responseId, feedbackContent) =>
                  dispatch(Actions.editResponseFeedback(responseId, feedbackContent))
                }
                onAddTargetedFeedback={() => dispatch(Actions.addTargetedFeedback())}
                onRemoveTargetedFeedback={(responseId: ActivityTypes.ResponseId) =>
                  dispatch(Actions.removeTargetedFeedback(responseId))
                }
                onEditTargetedFeedbackChoices={(
                  responseId: ActivityTypes.ResponseId,
                  choiceIds: ActivityTypes.ChoiceId[],
                ) => dispatch(Actions.editTargetedFeedbackChoices(responseId, choiceIds))}
              />
            )}
          </Feedback>
        </Panels.Tab>
        <Panels.Tab label="Hints">
          <Hints
            hints={getHints(model)}
            onAdd={() => dispatch(Actions.addHint())}
            onEdit={(id, content) => dispatch(Actions.editHint(id, content))}
            onRemove={(id) => dispatch(Actions.removeHint(id))}
          />
        </Panels.Tab>
      </Panels.Tabs>
    </>
  );
};

export class CheckAllThatApplyAuthoring extends AuthoringElement<CheckAllThatApplyModelSchema> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<CheckAllThatApplyModelSchema>) {
    console.log('props', props);
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
