import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DeliveryElement, DeliveryElementProps } from '../DeliveryElement';
import { CATASchema } from './schema';
import { defaultWriterContext } from 'data/content/writers/context';
import { IconCorrect, IconIncorrect } from 'components/misc/Icons';
import { Choices } from '../common/choices';
import { Hints } from '../common/hints';
import { Stem } from '../common/stem';
import { Checkbox } from '../common/authoring/icons/checkbox/Checkbox';
import { Manifest, RichText } from 'data/content/activities/activity';
import {
  ActivityDeliveryState,
  initializeState,
  isEvaluated,
  requestHint,
  reset,
  selectChoice,
  slice,
  submit,
} from '../../../data/state/state';
import { configureStore } from 'state/store';
import { SubmitButton } from './delivery/components/SubmitButton';
import { Evaluation } from '../common/delivery/Evaluation';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ResetButton } from '../common/delivery/ResetButton';
import { GradedPoints } from './delivery/components/GradedPoints';

export const store = configureStore({}, slice.reducer, 'CATA Delivery');

export const CheckAllThatApplyComponent = (props: DeliveryElementProps<CATASchema>) => {
  const state = useSelector((state: any) => state);
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
  console.log('evaluation', state.attemptState);

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
          unselectedIcon={<Checkbox.Unchecked />}
          selectedIcon={<Checkbox.Checked />}
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
export class CheckAllThatApplyDelivery extends DeliveryElement<CATASchema> {
  render(mountPoint: HTMLDivElement, props: DeliveryElementProps<CATASchema>) {
    ReactDOM.render(
      <Provider store={store}>
        <CheckAllThatApplyComponent {...props} />
      </Provider>,
      mountPoint,
    );
  }
}

// Register the web component:
// eslint-disable-next-line
const manifest = require('./manifest.json') as Manifest;
window.customElements.define(manifest.delivery.element, CheckAllThatApplyDelivery);
