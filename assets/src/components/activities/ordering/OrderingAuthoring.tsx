import React from 'react';
import ReactDOM from 'react-dom';
import { AuthoringElement, AuthoringElementProps } from '../AuthoringElement';
import { OrderingModelSchema } from './schema';
import * as ActivityTypes from '../types';
import { Stem } from '../common/authoring/Stem';
import { MovableChoices } from '../common/authoring/choices/Choices';
import { Feedback } from './sections/Feedback';
import { Hints } from '../common/authoring/Hints';
import { Actions } from './actions';
import { ModalDisplay } from 'components/modal/ModalDisplay';
import { Provider } from 'react-redux';
import { configureStore } from 'state/store';
import produce from 'immer';
import { TargetedFeedback } from 'components/activities/ordering/sections/TargetedFeedback';
<<<<<<< HEAD
import { getHints } from 'components/activities/common/authoring/utils';
import { isTargetedOrdering } from 'components/activities/ordering/utils';
=======
import { canMoveChoice, getHints, isTargetedOrdering } from 'components/activities/ordering/utils';
import { toggleAnswerChoiceShuffling } from 'components/activities/common/utils';
>>>>>>> 7a3c8771a70ea05211cabad4ff92582849b55004

const store = configureStore();

const Ordering = (props: AuthoringElementProps<OrderingModelSchema>) => {
  const dispatch = (action: (model: OrderingModelSchema) => void) =>
    props.onEdit(produce(props.model, action));

  const sharedProps = {
    model: props.model,
    editMode: props.editMode,
    projectSlug: props.projectSlug,
  };

  return (
    <React.Fragment>
      <Stem
        {...sharedProps}
        stem={props.model.stem}
        onEditContent={(content) => dispatch(Actions.editStem(content))}
      />

      <MovableChoices
        {...sharedProps}
<<<<<<< HEAD
        onAdd={() => dispatch(Actions.addChoice())}
        onEditContent={(id, content) => dispatch(Actions.editChoice(id, content))}
        onRemove={(id) => dispatch(Actions.removeChoice(id))}
        onMoveUp={(id) => dispatch(Actions.moveChoice('up', id))}
        onMoveDown={(id) => dispatch(Actions.moveChoice('down', id))}
=======
        onShuffle={() => dispatch(toggleAnswerChoiceShuffling())}
        onAddChoice={() => dispatch(Actions.addChoice())}
        onEditChoiceContent={(id, content) => dispatch(Actions.editChoiceContent(id, content))}
        onRemoveChoice={(id) => dispatch(Actions.removeChoice(id))}
        canMoveChoiceUp={(id) => canMoveChoice(props.model, id, 'up')}
        canMoveChoiceDown={(id) => canMoveChoice(props.model, id, 'down')}
        onMoveChoiceUp={(id) => dispatch(Actions.moveChoice('up', id))}
        onMoveChoiceDown={(id) => dispatch(Actions.moveChoice('down', id))}
>>>>>>> 7a3c8771a70ea05211cabad4ff92582849b55004
      />

      <Feedback
        {...sharedProps}
        onToggleFeedbackMode={() => dispatch(Actions.toggleType())}
        onEditFeedback={(responseId, feedbackContent) =>
          dispatch(Actions.editFeedback(responseId, feedbackContent))
        }
      >
        {isTargetedOrdering(props.model) && (
          <TargetedFeedback
            {...sharedProps}
            model={props.model}
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
        projectSlug={props.projectSlug}
        hints={getHints(props.model)}
        editMode={props.editMode}
        onAddHint={() => dispatch(Actions.addHint())}
        onEditHint={(id, content) => dispatch(Actions.editHint(id, content))}
        onRemoveHint={(id) => dispatch(Actions.removeHint(id))}
      />
    </React.Fragment>
  );
};

export class OrderingAuthoring extends AuthoringElement<OrderingModelSchema> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<OrderingModelSchema>) {
    ReactDOM.render(
      <Provider store={store}>
        <Ordering {...props} />
        <ModalDisplay />
      </Provider>,
      mountPoint,
    );
  }
}
// eslint-disable-next-line
const manifest = require('./manifest.json') as ActivityTypes.Manifest;
window.customElements.define(manifest.authoring.element, OrderingAuthoring);
