import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RichText, Stem } from 'components/activities/types';

interface Props {
  stem: Stem;
  onStemChange: (text: RichText) => void;
}

export const Unconnected: React.FC<Props> = ({ stem, onStemChange }) => {
  return (
    <div className="mb-2 flex-grow-1">
      <RichTextEditor
        style={{ padding: '16px', fontSize: '18px' }}
        text={stem.content}
        onEdit={onStemChange}
        placeholder="Question"
      />
    </div>
  );
};
