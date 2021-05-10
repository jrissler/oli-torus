import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RichText, Stem as StemType } from '../../types';

interface Props {
  onEditContent: (stem: RichText) => void;
  stem: StemType;
}

export const Stem = ({ stem, onEditContent }: Props) => (
  <div className="mb-2 flex-grow-1">
    <RichTextEditor
      style={{ backgroundColor: 'white', paddingTop: '16px', paddingBottom: '16px' }}
      text={stem.content}
      onEdit={onEditContent}
      placeholder="Question"
    />
  </div>
);
