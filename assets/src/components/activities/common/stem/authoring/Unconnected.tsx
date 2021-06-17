import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { IStem } from '../types';
import { RichText } from 'components/activities/types';

interface Props {
  stem: IStem;
  update: (text: RichText) => void;
}

export const Unconnected: React.FC<Props> = ({ stem, update }) => {
  return (
    <div className="mb-2 flex-grow-1" style={{ minHeight: '61px' }}>
      <RichTextEditor
        style={{ padding: '16px', fontSize: '18px' }}
        text={stem.content}
        onEdit={update}
        placeholder="Question"
      />
    </div>
  );
};
Unconnected.displayName = 'StemAuthoringEditor';
