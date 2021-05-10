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
import { Feedback } from './sections/Feedback';
import { Hints } from '../common/authoring/Hints';
import { Actions } from './actions';
import { ModalDisplay } from 'components/modal/ModalDisplay';
import { Provider } from 'react-redux';
import { configureStore } from 'state/store';
import produce from 'immer';
import { TargetedFeedback } from 'components/activities/check_all_that_apply/sections/TargetedFeedback';
import { isCorrectChoice, isTargetedCATA } from 'components/activities/check_all_that_apply/utils';
import { getHints, isShuffled } from 'components/activities/common/authoring/utils';
import { MovableChoices } from 'components/activities/common/authoring/choices/MovableChoices';
import { activeActivityEntries, ActivityEditorMap } from 'data/content/editors';
import Popover from 'react-tiny-popover';
import { classNames } from 'utils/classNames';
import { IconCorrect, IconIncorrect } from 'components/misc/Icons';
import { AuthoringButton } from 'components/misc/AuthoringButton';

const store = configureStore();

const CheckAllThatApply = () => {
  const {
    model,
    onEdit,
    editorMap,
    editMode,
  } = useAuthoringElementContext<CheckAllThatApplyModelSchema>();

  const dispatch = (action: (model: CheckAllThatApplyModelSchema) => void) =>
    onEdit(produce(model, action));

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <React.Fragment>
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <Stem
              stem={model.stem}
              onEditContent={(content) => dispatch(Actions.editStem(content))}
            />
            <AuthoringButton
              className={classNames([editMode ? '' : 'disabled'])}
              onClick={() => setIsPopoverOpen((isOpen) => !isOpen)}
            >
              <Popover
                containerClassName="add-resource-popover"
                onClickOutside={() => {
                  setIsPopoverOpen(false);
                }}
                isOpen={isPopoverOpen}
                align="end"
                transitionDuration={0}
                position={['left']}
                content={
                  <div
                    style={{
                      padding: '8px 0',
                      width: '320px',
                      backgroundColor: 'white',
                    }}
                    className="d-flex flex-column"
                  >
                    <div
                      style={{
                        cursor: 'pointer',
                        height: '46px',
                        lineHeight: '46px',
                      }}
                      className="d-flex align-items-center"
                      onClick={() => dispatch(Actions.toggleAnswerChoiceShuffling())}
                    >
                      <div
                        style={{
                          width: '40px',
                          marginLeft: '8px',
                          fontSize: '24px',
                        }}
                        className="d-flex align-items-center justify-content-end"
                      >
                        {isShuffled(model.authoring.transformations) && <IconCorrect />}
                      </div>
                      <div
                        style={{
                          padding: '0 16px',
                        }}
                      >
                        Shuffle answer choice order
                      </div>
                    </div>

                    <div
                      style={{
                        cursor: 'pointer',
                        height: '46px',
                        lineHeight: '46px',
                      }}
                      className="d-flex align-items-center"
                      onClick={() => dispatch(Actions.toggleType())}
                    >
                      <div
                        style={{
                          width: '40px',
                          marginLeft: '8px',
                          fontSize: '24px',
                        }}
                        className="d-flex align-items-center justify-content-end"
                      >
                        {isTargetedCATA(model) && <IconCorrect />}
                      </div>
                      <div
                        style={{
                          padding: '0 16px',
                        }}
                      >
                        Targeted feedback
                      </div>
                    </div>
                  </div>
                }
              >
                {(ref) => (
                  <div ref={ref} className="insert-button">
                    <i className="material-icons-outlined">more_vert</i>
                  </div>
                )}
              </Popover>
            </AuthoringButton>

            {/* <div className="btn-group">
              <button
                type="button"
                id="changeActivityTypeButton"
                // disabled={!editMode}
                className="btn btn-sm dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Check All That Apply
              </button>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="changeActivityTypeButton"
              >
                {activeActivityEntries(editorMap).map(([, editorDesc]) => (
                  <button
                    className="dropdown-item"
                    key={editorDesc.slug}
                    onClick={() =>
                      console.log('changing activity type to ', editorDesc.friendlyName)
                    }
                  >
                    {editorDesc.friendlyName}
                  </button>
                ))}
              </div>
            </div> */}
          </div>

          <MovableChoices
            model={model}
            isCorrect={isCorrectChoice}
            toggleCorrect={(choiceId: string) =>
              dispatch(Actions.toggleChoiceCorrectness(choiceId))
            }
            correctIcon={
              <i
                style={{
                  color: '#00bc8c',
                  fontSize: '30px',
                }}
                className="material-icons-outlined"
              >
                radio_button_checked
              </i>
            }
            incorrectIcon={
              <i
                style={{
                  color: 'rgba(0,0,0,0.26)',
                  fontSize: '30px',
                }}
                className="material-icons-outlined"
              >
                radio_button_unchecked
              </i>
            }
            choices={model.choices}
            onAdd={() => {
              dispatch(Actions.addChoice());
              document.activeElement?.blur();
            }}
            onEditContent={(id, content) => dispatch(Actions.editChoiceContent(id, content))}
            onRemove={(id) => dispatch(Actions.removeChoice(id))}
            onMoveUp={(id) => dispatch(Actions.moveChoice('up', id))}
            onMoveDown={(id) => dispatch(Actions.moveChoice('down', id))}
          />
        </div>
      </div>

      <Feedback
        model={model}
        onEditFeedback={(responseId, feedbackContent) =>
          dispatch(Actions.editFeedback(responseId, feedbackContent))
        }
      >
        {isTargetedCATA(model) && (
          <TargetedFeedback
            model={model}
            onEditFeedback={(responseId, feedbackContent) =>
              dispatch(Actions.editFeedback(responseId, feedbackContent))
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

      <Hints
        hints={getHints(model)}
        onAddHint={() => dispatch(Actions.addHint())}
        onEditHint={(id, content) => dispatch(Actions.editHint(id, content))}
        onRemoveHint={(id) => dispatch(Actions.removeHint(id))}
      />
    </React.Fragment>
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
