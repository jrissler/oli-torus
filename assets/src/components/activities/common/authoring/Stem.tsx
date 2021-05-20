import React, { useReducer } from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { HasStem, RichText, Stem as StemType } from '../../types';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { editStem } from 'components/activities/common/authoring/actions/stem';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import { WriterContext } from 'data/content/writers/context';
import produce from 'immer';
import { toSimpleText } from 'components/editing/utils';

type Action = { type: 'EDIT_STEM_CONTENT'; content: RichText };

function reducer(draft: HasStem, action: Action) {
  switch (action.type) {
    case 'EDIT_STEM_CONTENT': {
      draft.stem.content = action.content;
      draft.authoring.previewText = toSimpleText({ children: action.content.model });
      break;
    }
  }
}

interface AuthoringProps {
  // Managed by AuthoringElementContext
  stem?: StemType;
  onEdit?: (content: RichText) => void;
}

export const Authoring = (props: AuthoringProps) => {
  const { model } = useAuthoringElementContext<HasStem>();
  const [stem, dispatch] = useReducer(produce(reducer), props.stem || model.stem);

  return (
    <div className="mb-2 flex-grow-1">
      <RichTextEditor
        style={{ padding: '16px', fontSize: '18px' }}
        text={stem.content}
        onEdit={(content) => dispatch({ type: 'EDIT_STEM_CONTENT', content })}
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
