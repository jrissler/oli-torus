import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RichText, Hint } from '../../types';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { Card } from 'components/activities/common/authoring/Card';
import { Tooltip } from 'components/activities/common/authoring/Tooltip';

interface HintsProps {
  onAdd: () => void;
  onEdit: (id: string, content: RichText) => void;
  onRemove: (id: string) => void;
  hints: Hint[];
}

export const Hints = ({ onAdd, onEdit, onRemove, hints }: HintsProps) => {
  const deerInHeadlightsHint = hints[0];
  const bottomOutHint = hints[hints.length - 1];
  const cognitiveHints = hints.slice(1, hints.length - 1);

  return (
    <>
      <Card
        title={
          <>
            {'"Deer in headlights" hint'}
            <Tooltip title={'Restate the question for students who are totally confused'} />
          </>
        }
        content={
          <RichTextEditor
            placeholder="Restate the question"
            style={{ backgroundColor: 'white' }}
            text={deerInHeadlightsHint.content}
            onEdit={(content) => onEdit(deerInHeadlightsHint.id, content)}
          />
        }
      />

      <Card
        title={
          <>
            {'"Cognitive" hints'}
            <Tooltip title={'Explain how to solve the problem'} />
          </>
        }
        content={
          <>
            {cognitiveHints.map((hint, index) => (
              <div key={hint.id} className="d-flex">
                <span className="mr-3 mt-2">{index + 1}.</span>
                <RichTextEditor
                  placeholder="Explain how to solve the problem"
                  style={{ backgroundColor: 'white' }}
                  className="mb-2 flex-grow-1"
                  text={hint.content}
                  onEdit={(content) => onEdit(hint.id, content)}
                />
                <div className="d-flex align-items-stretch">
                  {index > 0 && <RemoveButton onClick={() => onRemove(hint.id)} />}
                </div>
              </div>
            ))}
            <AuthoringButton
              onClick={onAdd}
              style={{ marginLeft: '22px' }}
              className="btn btn-sm btn-link"
            >
              Add cognitive hint
            </AuthoringButton>
          </>
        }
      />

      <Card
        title={
          <>
            {'"Bottom out" hint'}
            <Tooltip title={'Explain the answer for students who are still lost'} />
          </>
        }
        content={
          <RichTextEditor
            placeholder="Explain how to solve the problem"
            style={{ backgroundColor: 'white' }}
            className="mb-2 flex-grow-1"
            text={bottomOutHint.content}
            onEdit={(content) => onEdit(bottomOutHint.id, content)}
          />
        }
      />
    </>
  );
};
