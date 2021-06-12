import {
  Choice,
  ChoiceId,
  Feedback,
  Hint,
  HintId,
  Part,
  Stem,
  Transformation,
} from 'components/activities/types';
import { denormalize, normalize, schema } from 'normalizr';
import { Id } from 'react-beautiful-dnd';
import { CATASchema } from '../schema';

const choice = new schema.Entity<Choice>('choices');
const stem = new schema.Entity<Stem>('stem');
const hint = new schema.Entity<Hint>('hints');
const feedback = new schema.Entity<Feedback>('feedback');
const response = new schema.Entity<Response>('responses', {
  feedback,
});
const transformation = new schema.Entity<Transformation>('transformation');
const part = new schema.Entity<Part>('parts', {
  responses: [response],
  hints: [hint],
});

export const mySchema = {
  stem,
  choices: [choice],
  authoring: {
    transformations: [transformation],
    feedback: [feedback],
    parts: [part],
  },
};

const mySchema2 = {
  choices: [choice],
  transformations: [transformation],
  parts: [part],
};

// export const normalizeModel = (model: CATASchema) => {};
// export const normalizeModel2 = (model: CATASchema) => {
//   const notToNormalize = {
//     stem: model.stem,
//     previewText: model.authoring.previewText,
//     feedback: model.authoring.feedback,
//   };
//   const toNormalize = {
//     choices: model.choices,
//     transformations: model.authoring.transformations,
//     parts: model.authoring.parts,
//   };
//   const normalized = normalize<
//     {
//       stem: Stem;
//       choices: ChoiceId[];
//       authoring: {
//         feedback: any[];
//         parts: Part['id'][];
//         hints: HintId[];
//       };
//     },
//     {
//       choices: { [key: string]: Choice };
//       hints: { [key: string]: Hint };
//       feedback: { [key: string]: Feedback };
//       responses: { [key: string]: Response };
//       transformations: { [key: string]: Transformation };
//       parts: { [key: string]: Part };
//     },
//     {
//       stem: Id;
//       choices: ChoiceId[];
//       previewText: string;
//       transformations: Id[];
//       parts: Id[];
//       feedback: any;
//     }
//   >(toNormalize, mySchema2);
//   console.log('normalized', normalized);
//   console.log('initial state from normalizer', {
//     ...notToNormalize,
//     choices: { entities: normalized.entities.choices, ids: normalized.result.choices },
//     parts: { entities: normalized.entities.parts, ids: normalized.result.parts },
//   });
//   return {
//     ...notToNormalize,
//     choices: { entities: normalized.entities.choices, ids: normalized.result.choices },
//     parts: { entities: normalized.entities.parts, ids: normalized.result.parts },
//   };
//   return normalized;
// };

// export const denormalizeModel = (state: CataRoot): CATASchema => {
// return {
//   stem: state.stem,
//   choices: denormalize(state.choices.ids, { choices: [choice] }, )
// }
// denormalize(normalized, mySchema2, )
// return {
//   stem: normalized.stem,
//   choices: selectAllChoices(normalized),
//   authoring: {
//     previewText: normalized.
//     parts: [],
//   } as any,
// };
// authoring: {
//   previewText: string;
//   transformations: Transformation[];
//   parts: Part[];
//   feedback: HasTargetedFeedback['authoring']['feedback'];
// };
// return denormalize(normalized.result, mySchema, normalized.entities);
// };
