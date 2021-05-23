import React, { PropsWithChildren, useReducer } from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { CheckAllThatApplyModelSchema } from '../../../check_all_that_apply/schema_old';
import { ChoiceId, Feedback, HasChoices, HasParts, ResponseId, RichText } from '../../../types';
import { defaultWriterContext } from 'data/content/writers/context';
import { DisplayedChoices } from 'components/activities/common/delivery/choices/DisplayedChoices';
import { Card } from 'components/activities/common/authoring/Card';
import {
  getCorrectChoiceIds,
  getCorrectResponse,
  getIncorrectResponse,
} from 'components/activities/check_all_that_apply/utils';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import produce, { Draft } from 'immer';
import { getResponse } from '../utils';

type FeedbackActions =
  | { type: 'SET_CORRECT_ANSWER_FEEDBACK'; id: ResponseId; content: RichText }
  | { type: 'SET_INCORRECT_ANSWER_FEEDBACK'; id: ResponseId; content: RichText }
  | { type: 'TOGGLE_CHOICE_CORRECTNESS'; id: ChoiceId };

const feedbackReducer = (draft: Draft<HasParts>, action: FeedbackActions) => {
  switch (action.type) {
    case 'SET_CORRECT_ANSWER_FEEDBACK':
    case 'SET_INCORRECT_ANSWER_FEEDBACK':
      getResponse(draft, action.id).feedback.content = action.content;
      break;
    case 'TOGGLE_CHOICE_CORRECTNESS':
      getChoiceIds(model.authoring.correct);
  }
};

export function useFeedback({ reducer = feedbackReducer } = {}) {
  const { model } = useAuthoringElementContext<HasParts>();
  const [state, dispatch] = useReducer(produce(reducer), model);
  const setCorrectAnswerFeedback = (id: ResponseId, content: RichText) =>
    dispatch({ type: 'SET_CORRECT_ANSWER_FEEDBACK', id, content });
  const setIncorrectAnswerFeedback = (id: ResponseId, content: RichText) =>
    dispatch({ type: 'SET_INCORRECT_ANSWER_FEEDBACK', id, content });
  const toggleChoiceCorrectness = (id: ChoiceId) =>
    dispatch({ type: 'TOGGLE_CHOICE_CORRECTNESS', id });

  return { state, setCorrectAnswerFeedback, setIncorrectAnswerFeedback };
}

interface FeedbackProps {
  onEditFeedback: (responseId: ResponseId, content: RichText) => void;
  toggleCorrect: any;
  isCorrect: any;
}
export const Feedback = (props: PropsWithChildren<FeedbackProps>) => {
  const { state, setCorrectAnswerFeedback, setIncorrectAnswerFeedback } = useFeedback();

  const { onEditFeedback } = props;
  const writerContext = defaultWriterContext();

  return (
    <>
      <DisplayedChoices
        unselectedIcon={<i className="material-icons-outlined">check_box_outline_blank</i>}
        selectedIcon={<i className="material-icons-outlined">check_box</i>}
        choices={model.choices}
        selected={getCorrectChoiceIds(model)}
        onSelect={(id) => props.toggleCorrect(id)}
        isEvaluated={false}
        context={writerContext}
      />

      <Card
        title="Feedback for correct answer"
        content={
          <RichTextEditor
            style={{ backgroundColor: 'white' }}
            placeholder="Enter feedback"
            text={getCorrectResponse(model).feedback.content}
            onEdit={(content) => onEditFeedback(getCorrectResponse(model).id, content)}
          />
        }
      />

      <Card
        title="Feedback for incorrect answers"
        content={
          <RichTextEditor
            style={{ backgroundColor: 'white' }}
            placeholder="Enter feedback"
            text={getIncorrectResponse(model).feedback.content}
            onEdit={(content) => onEditFeedback(getIncorrectResponse(model).id, content)}
          />
        }
      />
    </>
  );
};
