import React from 'react';
import { getResponse } from 'components/activities/common/authoring/utils';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { ID } from 'data/content/model';
import { ChoiceIdsToResponseId } from 'components/activities/check_all_that_apply/schema_old';
import { HasTargetedFeedback, TargetedFeedbackEnabled } from './types';
import { ChoiceId, RichText } from 'components/activities/types';
import { HasParts } from '../../authoring/parts/types';
import { IResponse } from '../../authoring/responses/types';
import { ResponseFeedbackCard } from '../common/ResponseCard';
import { IChoice } from '../../choices/types';

// Choices
export const getChoiceIds = ([choiceIds]: ChoiceIdsToResponseId) => choiceIds;
export const getCorrectChoiceIds = (model: HasTargetedFeedback) =>
  getChoiceIds(model.authoring.feedback.correct);
export const getIncorrectChoiceIds = (model: HasTargetedFeedback) =>
  getChoiceIds(model.authoring.feedback.incorrect);
export const getTargetedChoiceIds = (model: TargetedFeedbackEnabled) =>
  model.authoring.feedback.targeted.map(getChoiceIds);
export const isCorrectChoice = (model: HasTargetedFeedback, choiceId: ChoiceId) =>
  getCorrectChoiceIds(model).includes(choiceId);

// Responses
export const getResponseId = ([, responseId]: ChoiceIdsToResponseId) => responseId;
export const getCorrectResponse = (model: HasTargetedFeedback) =>
  getResponse(model, getResponseId(model.authoring.feedback.correct));
export const getIncorrectResponse = (model: HasTargetedFeedback) =>
  getResponse(model, getResponseId(model.authoring.feedback.incorrect));
export const getTargetedResponses = (model: TargetedFeedbackEnabled & HasParts) =>
  model.authoring.feedback.targeted.map((assoc) => getResponse(model, getResponseId(assoc)));

// Rules
export const createRuleForIds = (toMatch: ID[], notToMatch: ID[]) =>
  unionRules(
    toMatch.map(createMatchRule).concat(notToMatch.map((id) => invertRule(createMatchRule(id)))),
  );
export const createMatchRule = (id: string) => `input like {${id}}`;
export const invertRule = (rule: string) => `(!(${rule}))`;
export const unionTwoRules = (rule1: string, rule2: string) => `${rule2} && (${rule1})`;
export const unionRules = (rules: string[]) => rules.reduce(unionTwoRules);

// Other
export function setDifference<T>(subtractedFrom: T[], toSubtract: T[]): T[] {
  return subtractedFrom.filter((x) => !toSubtract.includes(x));
}

interface HydratedResponseMapping {
  response: IResponse;
  choiceIds: ChoiceId[];
}
interface Props {
  choices: IChoice[];
  targetedMappings: HydratedResponseMapping[];
  toggleChoice: (id: ChoiceId, responseId: ID) => void;
  updateFeedback: (id: ID, content: RichText) => void;
  addTargetedResponse: () => void;
}
export const Unconnected: React.FC<Props> = ({
  choices,
  targetedMappings,
  toggleChoice,
  updateFeedback,
  addTargetedResponse,
}) => {
  return (
    <>
      {targetedMappings.map((mapping) => (
        <ResponseFeedbackCard
          key={mapping.response.id}
          title="Targeted feedback"
          feedback={mapping.response.feedback}
          choices={choices}
          correctChoiceIds={mapping.choiceIds}
          toggleChoice={(id) => toggleChoice(id, mapping.response.id)}
          updateFeedback={updateFeedback}
        />
      ))}
      <AuthoringButton
        style={{ marginLeft: 13 }}
        className="btn btn-link pl-2"
        onClick={() => addTargetedResponse()}
      >
        Add targeted feedback
      </AuthoringButton>
    </>
  );
};
Unconnected.displayName = 'TargetedFeedbackAuthoringEditor';
