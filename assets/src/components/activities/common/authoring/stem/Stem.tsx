import React, { useReducer } from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { HasStem, RichText, Stem as StemType } from '../../../types';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import { WriterContext } from 'data/content/writers/context';
import produce, { Draft } from 'immer';

type StemActions = { type: 'SET_STEM_CONTENT'; content: RichText };

// export const stemReducer = (draft: Draft<HasStem>, action: StemActions) => {
//   switch (action.type) {
//     case 'SET_STEM_CONTENT': {
//       draft.stem.content = action.content;
//       break;
//     }
//   }
// }
// onEditContent={(content) => dispatch(MCActions.editStem(content))}

// dispatch(  (content: RichText) => {
//   return (model: HasStem & HasPreviewText) => {
//     model.stem.content = content;
//     model.authoring.previewText = toSimpleText({ children: content.model });
//   };

export function useStem() {
  const { model, dispatch } = useAuthoringElementContext<HasStem>();

  const setStem = (content: RichText) =>
    dispatch((draft: Draft<HasStem>) => {
      draft.stem.content = content;
    });

  return { stem: model.stem, setStem };
}

interface AuthoringProps {
  onStemChange?: (text: RichText) => void;
}

export const Authoring = ({ onStemChange }: AuthoringProps) => {
  const { stem, setStem } = useStem();

  return (
    <div className="mb-2 flex-grow-1">
      <RichTextEditor
        style={{ padding: '16px', fontSize: '18px' }}
        text={stem.content}
        onEdit={(text) => {
          console.log('text', text)
          setStem(text);
          onStemChange && onStemChange(text);
        }}
        placeholder="Question"
      />
    </div>
  );
};

interface DeliveryProps {
  stem: StemType;
  context: WriterContext;
}

export const Delivery = ({ stem, context }: DeliveryProps) => {
  return <HtmlContentModelRenderer text={stem.content} context={context} />;
};

export const Stem = {
  Authoring,
  Delivery,
};
