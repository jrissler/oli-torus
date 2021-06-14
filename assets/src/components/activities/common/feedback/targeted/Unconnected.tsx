import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { Description } from 'components/misc/Description';
import { IconIncorrect } from 'components/misc/Icons';
import { Typeahead } from 'react-bootstrap-typeahead';
import { getResponse, getResponses } from 'components/activities/common/authoring/utils';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { ID } from 'data/content/model';
import produce, { Draft } from 'immer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChoiceIdsToResponseId } from 'components/activities/check_all_that_apply/schema_old';
import { HasTargetedFeedback, TargetedFeedbackEnabled } from './types';
import { ChoiceId, ResponseId, RichText } from 'components/activities/types';
import { HasParts } from '../../authoring/parts/types';
import {IResponse} from '../../authoring/responses/types'

interface Option {
  id: string;
  label: string;
}
type OptionMap = { [id: string]: Option[] };

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

// addTargetedFeedback: () => {
//     return (model: CATA) => {
//       switch (model.type) {
//         case 'SimpleCATA':
//           return;
//         case 'TargetedCATA':
//           // eslint-disable-next-line
//           const response = makeResponse(
//             createRuleForIds(
//               [],
//               model.choices.map(({ id }) => id),
//             ),
//             0,
//             '',
//           );

//           getResponses(model).push(response);
//           model.authoring.targeted.push([[], response.id]);
//           return;
//       }
//     };
//   },

//   removeTargetedFeedback: (responseId: ResponseId) => {
//     return (model: CATA) => {
//       switch (model.type) {
//         case 'SimpleCATA':
//           return;
//         case 'TargetedCATA':
//           removeFromList(getResponse(model, responseId), getResponses(model));
//           removeFromList(
//             model.authoring.targeted.find((assoc) => getResponseId(assoc) === responseId),
//             model.authoring.targeted,
//           );
//       }
//     };
//   },

//   editTargetedFeedbackChoices: (responseId: ResponseId, choiceIds: ChoiceId[]) => {
//     return (model: CATA) => {
//       switch (model.type) {
//         case 'SimpleCATA':
//           break;
//         case 'TargetedCATA':
//           // eslint-disable-next-line
//           const assoc = model.authoring.targeted.find(
//             (assoc) => getResponseId(assoc) === responseId,
//           );
//           if (!assoc) break;
//           assoc[0] = choiceIds;
//           break;
//       }
//       updateResponseRules(model);
//     };
//   },

// Update all response rules from new choices that are not yet reflected by the rules.

// const useTargetedFeedback = () => {
//   // const { editMode, model, dispatch } = useAuthoringElementContext<HasTargetedFeedback>();
//   // const { setResponseFeedback } = useFeedback();

//   const addTargetedFeedback = () =>
//     produce((model: Draft<HasTargetedFeedback>) => {
//       const response = makeResponse(
//         createRuleForIds(
//           [],
//           model.choices.map(({ id }) => id),
//         ),
//         0,
//         '',
//       );

//       getResponses(model).push(response);
//       model.authoring.feedback.targeted.push([[], response.id]);
//     });

//   const removeTargetedFeedback = (responseId: ResponseId) =>
//     produce((model: Draft<HasTargetedFeedback>) => {
//       removeFromList(getResponse(model, responseId), getResponses(model));
//       removeFromList(
//         model.authoring.feedback.targeted.find((assoc) => getResponseId(assoc) === responseId),
//         model.authoring.feedback.targeted,
//       );
//     });

//   const editTargetedFeedbackChoices = (responseId: ResponseId, choiceIds: ChoiceId[]) =>
//     produce((model: Draft<HasTargetedFeedback>) => {
//       const assoc = model.authoring.feedback.targeted.find(
//         (assoc) => getResponseId(assoc) === responseId,
//       );
//       if (!assoc) return;
//       assoc[0] = choiceIds;

//       syncResponseRules(model);
//     });

//   return {
//     // model,
//     // editMode,
//     // // setResponseFeedback,
//     // addTargetedFeedback,
//     // removeTargetedFeedback,
//     // editTargetedFeedbackChoices,
//     // dispatch,
//   };
// };

interface Props {
  onEditFeedback?: (id: string, content: RichText) => void;
  onAddTargetedFeedback: () => void;
  onRemoveTargetedFeedback: (responseId: ResponseId) => void;
  onEditTargetedFeedbackChoices: (responseId: ResponseId, choiceIds: ChoiceId[]) => void;
  responses: IResponse[];
}
export const Unconnected: React.FC<Props> = ({
  onEditFeedback,
  onAddTargetedFeedback,
  onRemoveTargetedFeedback,
  onEditTargetedFeedbackChoices,
  children,
}) => {
  return <></>

  // const createSelection = (assocs: ChoiceIdsToResponseId[]) =>
  //   assocs.reduce((acc, assoc) => {
  //     acc[getResponseId(assoc)] = toOptions(getChoiceIds(assoc));
  //     return acc;
  //   }, {} as OptionMap);

  // const toOptions = (choiceIds: ChoiceId[]) =>
  //   choiceIds.map((id) => ({
  //     id,
  //     label: (model.choices.findIndex((choice) => choice.id === id) + 1).toString(),
  //   }));

  // const allChoiceOptions = toOptions(model.choices.map((choice) => choice.id));
  // const selected = createSelection(model.authoring.feedback.targeted);

  // return (
  //   <>


  //     {model.authoring.feedback.targeted.map((assoc) => {
  //       const response = getResponse(model, getResponseId(assoc));
  //       return (
  //         <div className="mb-3" key={response.id}>
  //           <Description>
  //             <IconIncorrect /> Feedback for Incorrect Combination
  //             <Typeahead
  //               id={response.id}
  //               disabled={!editMode}
  //               placeholder="Select choices..."
  //               options={allChoiceOptions}
  //               selected={selected[response.id]}
  //               selectHintOnEnter
  //               multiple
  //               onChange={(selection) =>
  //                 onEditTargetedFeedbackChoices
  //                   ? onEditTargetedFeedbackChoices(
  //                       response.id,
  //                       selection.map((s) => s.id),
  //                     )
  //                   : dispatch(
  //                       editTargetedFeedbackChoices(
  //                         response.id,
  //                         selection.map((s) => s.id),
  //                       ),
  //                     )
  //               }
  //             />
  //           </Description>
  //           <div className="d-flex align-items-center" style={{ flex: 1 }}>
  //             <RichTextEditor
  //               className="flex-fill"
  //               text={response.feedback.content}
  //               onEdit={(content) =>
  //                 onEditFeedback
  //                   ? onEditFeedback(response.id, content)
  //                   : setResponseFeedback(response.id, content)
  //               }
  //             />
  //             <RemoveButton
  //               onClick={() =>
  //                 onRemoveTargetedFeedback
  //                   ? onRemoveTargetedFeedback(response.id)
  //                   : removeTargetedFeedback(response.id)
  //               }
  //             />
  //           </div>
  //         </div>
  //       );
  //     })}
  //     <AuthoringButton
  //       className="btn btn-sm btn-primary my-2"
  //       onClick={onAddTargetedFeedback}
  //     >
  //       Add targeted feedback
  //     </AuthoringButton>
  //   </>
  // );
};
