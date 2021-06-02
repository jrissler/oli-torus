// import { CheckAllThatApplyModelSchemaV2 as CATA } from './schema';
// import {
//   createRuleForIds,
//   getCorrectResponse,
//   getChoiceIds,
//   getCorrectChoiceIds,
//   getIncorrectChoiceIds,
//   getIncorrectResponse,
//   getResponseId,
//   setDifference,
//   invertRule,
//   unionRules,
// } from './utils';
// import { RichText, Hint as HintType, ChoiceId, Choice, ResponseId } from '../types';
// import { getHints, getResponses, makeResponse } from 'components/activities/common/authoring/utils';

// export const Actions = {
//   toggleType: () => {
//     return (model: CATA) => {
//       if (isSimpleCATA(model)) {
//         (model as any).type = 'TargetedCATA';
//         (model as any).authoring.targeted = [];
//         return;
//       }

//       (model as any).type = 'SimpleCATA';
//       delete (model as any).authoring.targeted;
//     };
//   },

//   // editStem,

//   addChoice: () => {
//     return (model: CATA) => {
//       // const newChoice: Choice = fromText('');

//       // model.choices.push(newChoice);
//       getChoiceIds(model.authoring.incorrect).push(newChoice.id);
//       updateResponseRules(model);
//     };
//   },

//   // editChoiceContent: (id: string, content: RichText) => {
//   //   return (model: CATA) => {
//   //     getChoice(model, id).content = content;
//   //   };
//   // },

//   removeChoice: (id: string) => {
//     return (model: CATA) => {
//       // const removeIdFrom = (list: string[]) => removeFromList(id, list);
//       // model.choices = model.choices.filter((choice) => choice.id !== id);
//       removeIdFrom(getChoiceIds(model.authoring.correct));
//       removeIdFrom(getChoiceIds(model.authoring.incorrect));

//       switch (model.type) {
//         case 'SimpleCATA':
//           break;
//         case 'TargetedCATA':
//           model.authoring.targeted.forEach((assoc) => removeIdFrom(getChoiceIds(assoc)));
//       }

//       updateResponseRules(model);
//     };
//   },

//   toggleChoiceCorrectness: (choiceId: ChoiceId) => {
//     return (model: CATA) => {
//       const addOrRemoveId = (list: string[]) => addOrRemoveFromList(choiceId, list);
//       // targeted response choices do not need to change

//       addOrRemoveId(getChoiceIds(model.authoring.correct));
//       addOrRemoveId(getChoiceIds(model.authoring.incorrect));
//       updateResponseRules(model);
//     };
//   },

//   editResponseFeedback: (responseId: ResponseId, content: RichText) => {
//     return (model: CATA) => {
//       getResponse(model, responseId).feedback.content = content;
//     };
//   },

//   addTargetedFeedback: () => {
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

//   // addHint: () => {
//   //   return (model: CATA) => {
//   //     const newHint: HintType = fromText('');
//   //     // new hints are always cognitive hints. they should be inserted
//   //     // right before the bottomOut hint at the end of the list
//   //     const bottomOutIndex = getHints(model).length - 1;
//   //     getHints(model).splice(bottomOutIndex, 0, newHint);
//   //   };
//   // },

//   // editHint: (id: string, content: RichText) => {
//   //   return (model: CATA) => {
//   //     getHint(model, id).content = content;
//   //   };
//   // },

//   // removeHint: (id: string) => {
//   //   return (model: CATA) => {
//   //     model.authoring.parts[0].hints = getHints(model).filter((h) => h.id !== id);
//   //   };
//   // },
// };

// // mutable
// function addOrRemoveFromList<T>(item: T, list: T[]) {
//   if (list.find((x) => x === item)) {
//     return removeFromList(item, list);
//   }
//   return list.push(item);
// }
// // mutable
// function removeFromList<T>(item: T, list: T[]) {
//   const index = list.findIndex((x) => x === item);
//   if (index > -1) {
//     list.splice(index, 1);
//   }
// }

// // Update all response rules based on a model with new choices that
// // are not yet reflected by the rules.
// const updateResponseRules = (model: CATA) => {
//   getCorrectResponse(model).rule = createRuleForIds(
//     getCorrectChoiceIds(model),
//     getIncorrectChoiceIds(model),
//   );

//   switch (model.type) {
//     case 'SimpleCATA':
//       getIncorrectResponse(model).rule = invertRule(getCorrectResponse(model).rule);
//       break;
//     case 'TargetedCATA':
//       // eslint-disable-next-line
//       const targetedRules: string[] = [];
//       // eslint-disable-next-line
//       const allChoiceIds = model.choices.map((choice) => choice.id);
//       model.authoring.targeted.forEach((assoc) => {
//         const targetedRule = createRuleForIds(
//           getChoiceIds(assoc),
//           setDifference(allChoiceIds, getChoiceIds(assoc)),
//         );
//         targetedRules.push(targetedRule);
//         getResponse(model, getResponseId(assoc)).rule = targetedRule;
//       });
//       getIncorrectResponse(model).rule = unionRules(
//         targetedRules.map(invertRule).concat([invertRule(getCorrectResponse(model).rule)]),
//       );
//       break;
//   }
// };
