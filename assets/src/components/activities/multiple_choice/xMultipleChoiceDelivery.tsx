import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  DeliveryElement,
  DeliveryElementProps,
  EvaluationResponse,
  RequestHintResponse,
  ResetActivityResponse,
} from '../DeliveryElement';
import { MCSchema } from './schema';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import { Maybe } from 'tsmonad';
import { ResetButton } from '../common/delivery/ResetButton';
import { Evaluation } from '../common/delivery/Evaluation';
import { IconCorrect, IconIncorrect } from 'components/misc/Icons';
import { defaultWriterContext, WriterContext } from 'data/content/writers/context';
import { Hints } from '../common/hints';
import { Stem } from '../common/stem';
import { IChoice } from '../common/choices/types';
import { FeedbackAction } from '../common/feedback/types';
import { Manifest, RichText } from 'data/content/activities/activity';
import { Choices } from '../common/choices';
import { Radio } from '../common/authoring/icons/radio/Radio';

type Evaluation = {
  score: number;
  outOf: number;
  feedback: RichText;
};

export const MultipleChoiceComponent = (props: DeliveryElementProps<MCSchema>) => {
  const [model, setModel] = useState(props.model);
  const [attemptState, setAttemptState] = useState(props.state);
  const [hints, setHints] = useState(props.state.parts[0].hints);
  const [hasMoreHints, setHasMoreHints] = useState(props.state.parts[0].hasMoreHints);
  const [selected, setSelected] = useState(
    props.state.parts[0].response === null
      ? []
      : [(props.state.parts[0].response as any).input as string],
  );

  const { stem, choices } = model;

  const isEvaluated = attemptState.score !== null;

  const writerContext = defaultWriterContext({ sectionSlug: props.sectionSlug });

  const onSelect = (id: string) => {
    // Update local state
    setSelected([id]);

    if (props.graded) {
      // In summative context, post the student response to save it
      props.onSaveActivity(attemptState.attemptGuid, [
        { attemptGuid: attemptState.parts[0].attemptGuid, response: { input: id } },
      ]);
    } else {
      // Auto-submit our student reponse in formative context
      props
        .onSubmitActivity(attemptState.attemptGuid, [
          { attemptGuid: attemptState.parts[0].attemptGuid, response: { input: id } },
        ])
        .then((response: EvaluationResponse) => {
          if (response.actions.length > 0) {
            const action: FeedbackAction = response.actions[0] as FeedbackAction;

            const { score, out_of, feedback, error } = action;
            const parts = [Object.assign({}, attemptState.parts[0], { feedback, error })];
            const updated = Object.assign({}, attemptState, { score, outOf: out_of, parts });
            setAttemptState(updated);
          }
        });
    }
  };

  const onRequestHint = () => {
    props
      .onRequestHint(attemptState.attemptGuid, attemptState.parts[0].attemptGuid)
      .then((state: RequestHintResponse) => {
        if (state.hint !== undefined) {
          setHints([...hints, state.hint] as any);
        }
        setHasMoreHints(state.hasMoreHints);
      });
  };

  const onReset = () => {
    props.onResetActivity(attemptState.attemptGuid).then((state: ResetActivityResponse) => {
      setSelected([]);
      setAttemptState(state.attemptState);
      setModel(state.model as MCSchema);
      setHints([]);
      setHasMoreHints(props.state.parts[0].hasMoreHints);
    });
  };

  const evaluationSummary = isEvaluated && (
    <Evaluation key="evaluation" attemptState={attemptState} context={writerContext} />
  );

  const reset =
    isEvaluated && !props.graded ? (
      <div className="d-flex my-3">
        <div className="flex-fill"></div>
        <ResetButton hasMoreAttempts={attemptState.hasMoreAttempts} onClick={onReset} />
      </div>
    ) : null;

  const ungradedDetails = !props.graded && [
    evaluationSummary,
    <Hints.Delivery
      key="hints"
      onClick={onRequestHint}
      hints={hints}
      hasMoreHints={hasMoreHints}
      isEvaluated={isEvaluated}
      context={writerContext}
    />,
  ];

  const gradedDetails = props.graded && props.review ? [evaluationSummary] : null;

  const correctnessIcon = attemptState.score === 0 ? <IconIncorrect /> : <IconCorrect />;

  const gradedPoints =
    props.graded && props.review
      ? [
          <div key="correct" className="text-info font-italic">
            {correctnessIcon}
            <span>Points: </span>
            <span>{attemptState.score + ' out of ' + attemptState.outOf}</span>
          </div>,
        ]
      : null;

  return (
    <div className={`activity multiple-choice-activity ${isEvaluated ? 'evaluated' : ''}`}>
      <div className="activity-content">
        <Stem.Delivery stem={stem} context={writerContext} />
        {gradedPoints}
        <Choices.Delivery
          unselectedIcon={<Radio.Unchecked />}
          selectedIcon={<Radio.Checked />}
          choices={choices}
          selected={selected}
          onSelect={onSelect}
          isEvaluated={isEvaluated}
          context={writerContext}
        />
        {ungradedDetails}
        {gradedDetails}
      </div>
      {reset}
    </div>
  );
};

// Defines the web component, a simple wrapper over our React component above
export class MultipleChoiceDelivery extends DeliveryElement<MCSchema> {
  render(mountPoint: HTMLDivElement, props: DeliveryElementProps<MCSchema>) {
    ReactDOM.render(<MultipleChoiceComponent {...props} />, mountPoint);
  }
}

// Register the web component:
// eslint-disable-next-line
const manifest = require('./manifest.json') as Manifest;
window.customElements.define(manifest.delivery.element, MultipleChoiceDelivery);
