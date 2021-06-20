import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RichText } from 'data/content/activities/activity';
import { IStem } from 'data/content/activities/stem';

interface Props {
  stem: IStem;
  update: (text: RichText) => void;
}

export const Unconnected: React.FC<Props> = ({ stem, update }) => {
  return (
    <div className="flex-grow-1">
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
