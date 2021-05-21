import React, { useReducer } from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { HasStem, RichText, Stem as StemType } from '../../../types';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import { WriterContext } from 'data/content/writers/context';
import produce from 'immer';
import { makeStem } from 'components/activities/common/authoring/utils';

type StemActions = { type: 'EDIT_STEM_CONTENT'; content: RichText };

export function stemReducer(draft: HasStem, action: StemActions) {
  switch (action.type) {
    case 'EDIT_STEM_CONTENT': {
      draft.stem.content = action.content;
      break;
    }
  }
}

export function useStem({ reducer = stemReducer } = {}) {
  const { model } = useAuthoringElementContext<HasStem>();
  const [{ stem }, dispatch] = useReducer(
    produce(reducer),
    model || { stem: makeStem('Question') },
  );

  const setStem = (content: RichText) => dispatch({ type: 'EDIT_STEM_CONTENT', content });

  return { stem, setStem };
}

interface AuthoringProps {
  // Managed by AuthoringElementContext
  onEdit?: (content: RichText) => void;
}

export const Authoring = (props: AuthoringProps) => {
  const { stem, setStem } = useStem();
  return (
    <div className="mb-2 flex-grow-1">
      <RichTextEditor
        style={{ padding: '16px', fontSize: '18px' }}
        text={stem.content}
        onEdit={setStem}
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
