import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { HasStem, RichText, Stem as StemType } from '../../types';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import { WriterContext } from 'data/content/writers/context';
import produce, { Draft } from 'immer';

export function useStem() {
  const { model: { stem }, dispatch } = useAuthoringElementContext<HasStem>();

  const setStem = (content: RichText) =>
    produce((draft: Draft<HasStem>) => {
      draft.stem.content = content;
    });

  return { stem, setStem, dispatch };
}

interface AuthoringProps {
  onStemChange?: (text: RichText) => void;
}

export const Authoring = ({ onStemChange }: AuthoringProps) => {
  const { stem, setStem, dispatch } = useStem();

  return (
    <div className="mb-2 flex-grow-1">
      <RichTextEditor
        style={{ padding: '16px', fontSize: '18px' }}
        text={stem.content}
        onEdit={(text) => (onStemChange ? onStemChange(text) : dispatch(setStem(text)))}
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
