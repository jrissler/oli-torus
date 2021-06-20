import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DeliveryElement, DeliveryElementProps } from '../DeliveryElement';
import { MCSchema } from './schema';
import { ResetButton } from '../common/delivery/ResetButton';
import { Evaluation } from '../common/delivery/Evaluation';
import { IconCorrect, IconIncorrect } from 'components/misc/Icons';
import { defaultWriterContext } from 'data/content/writers/context';
import { Hints } from '../common/hints';
import { Stem } from '../common/stem';
import { Manifest, RichText } from 'data/content/activities/activity';
import { Choices } from '../common/choices';
import {
  isEvaluated,
  requestHint,
  reset,
  selectChoice,
  submit,
  slice,
  initializeState,
  ActivityDeliveryState,
} from '../../../data/state/state';
import { GradedPoints } from '../check_all_that_apply/delivery/components/GradedPoints';
import { Radio } from '../common/authoring/icons/radio/Radio';
import { SubmitButton } from '../check_all_that_apply/delivery/components/SubmitButton';
import { configureStore } from 'state/store';
import { Provider, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({}, slice.reducer, 'CATA Delivery');

export const MultipleChoiceComponent = (props: DeliveryElementProps<MCSchema>) => {
  const state = useSelector((state: ActivityDeliveryState & any) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeState(props.model, props.state));
  }, []);

  if (!state.model) {
    return null;
  }

  const {
    attemptState,
    model: { stem, choices },
    selectedChoices,
    hints,
    hasMoreHints,
  } = state;

  const writerContext = defaultWriterContext({ sectionSlug: props.sectionSlug });

  return (
    <div className={`activity cata-activity ${isEvaluated(state) ? 'evaluated' : ''}`}>
      <div className="activity-content">
        <Stem.Delivery stem={stem} context={writerContext} />
        <GradedPoints
          shouldShow={props.graded && props.review}
          icon={attemptState.score === 0 ? <IconIncorrect /> : <IconCorrect />}
          attemptState={attemptState}
        />
        <Choices.Delivery
          unselectedIcon={<Radio.Unchecked />}
          selectedIcon={<Radio.Checked />}
          choices={choices}
          selected={selectedChoices}
          onSelect={(id) => dispatch(selectChoice(id, props.onSaveActivity))}
          isEvaluated={isEvaluated(state)}
          context={writerContext}
        />
        <ResetButton
          shouldShow={isEvaluated(state) && !props.graded}
          disabled={!attemptState.hasMoreAttempts}
          onClick={() => dispatch(reset(props.onResetActivity))}
        />
        <SubmitButton
          shouldShow={!isEvaluated(state) && !props.graded}
          disabled={selectedChoices.length === 0}
          onClick={() => dispatch(submit(props.onSubmitActivity))}
        />
        <Hints.Delivery
          shouldShow={!isEvaluated(state) && !props.graded}
          key="hints"
          onClick={() => dispatch(requestHint(props.onRequestHint))}
          hints={hints}
          hasMoreHints={hasMoreHints}
          isEvaluated={isEvaluated(state)}
          context={writerContext}
        />
        <Evaluation
          shouldShow={isEvaluated(state) && (!props.graded || props.review)}
          key="evaluation"
          attemptState={attemptState}
          context={writerContext}
        />
      </div>
    </div>
  );
};

// Defines the web component, a simple wrapper over our React component above
export class MultipleChoiceDelivery extends DeliveryElement<MCSchema> {
  render(mountPoint: HTMLDivElement, props: DeliveryElementProps<MCSchema>) {
    ReactDOM.render(
      <Provider store={store}>
        <MultipleChoiceComponent {...props} />
      </Provider>,
      mountPoint,
    );
  }
}

// Register the web component:
// eslint-disable-next-line
const manifest = require('./manifest.json') as Manifest;
window.customElements.define(manifest.delivery.element, MultipleChoiceDelivery);
