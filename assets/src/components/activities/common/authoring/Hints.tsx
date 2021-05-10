import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RichText, Hint } from '../../types';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';

interface TooltipProps {
  title: string;
}
const Tooltip = ({ title }: TooltipProps) => {
  return (
    <i
      className="ml-2 material-icons-outlined"
      data-toggle="tooltip"
      data-placement="top"
      title={title}
    >
      info
    </i>
  );
};

interface HintProps {
  hint: Hint;
  onEdit: (id: string, content: RichText) => void;
  title: string | JSX.Element;
  tooltip?: JSX.Element;
  placeholder?: string;
}
const HintCard = ({ hint, onEdit, tooltip, title, placeholder }: HintProps) => {
  return (
    // <div
    //   className="d-flex flex-column mb-1"
    //   style={{
    //     backgroundColor: '#f8f9fa',
    //     padding: '5px 5px 10px 20px',
    //     borderRadius: '4px',
    //   }}
    // >
    //   <div
    //     style={{
    //       height: '50px',
    //       fontWeight: 500,
    //     }}
    //     className="d-flex align-items-center"
    //   >
    <div className="card">
      <div className="card-body">
        <div className="card-title d-flex align-items-center">
          {title}
          {tooltip}
        </div>
        <RichTextEditor
          placeholder={placeholder}
          style={{ backgroundColor: 'white' }}
          className="mb-3"
          text={hint.content}
          onEdit={(content) => onEdit(hint.id, content)}
        />
      </div>
    </div>
  );
};

interface HintsProps {
  onAddHint: () => void;
  onEditHint: (id: string, content: RichText) => void;
  onRemoveHint: (id: string) => void;
  hints: Hint[];
}

export const Hints = ({ onAddHint, onEditHint, onRemoveHint, hints }: HintsProps) => {
  const deerInHeadlightsHint = hints[0];
  const bottomOutHint = hints[hints.length - 1];
  const cognitiveHints = hints.slice(1, hints.length - 1);

  return (
    <div className="my-5">
      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex align-items-center">
            {'"Deer in headlights" hint'}
            <Tooltip title={'Restate the question for students who are totally confused'} />
          </div>
          <RichTextEditor
            placeholder="Restate the question"
            style={{ backgroundColor: 'white' }}
            text={deerInHeadlightsHint.content}
            onEdit={(content) => onEditHint(deerInHeadlightsHint.id, content)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex align-items-center">
            {'"Cognitive" hints'}
            <Tooltip title={'Explain how to solve the problem'} />
          </div>
          {cognitiveHints.map((hint, index) => (
            <div key={hint.id} className="d-flex">
              <span className="mr-3 mt-2">{index + 1}.</span>
              <RichTextEditor
                placeholder="Explain how to solve the problem"
                style={{ backgroundColor: 'white' }}
                className="mb-2 flex-grow-1"
                text={hint.content}
                onEdit={(content) => onEditHint(hint.id, content)}
              />
              <div className="d-flex align-items-stretch">
                {index > 0 && <RemoveButton onClick={() => onRemoveHint(hint.id)} />}
              </div>
            </div>
          ))}
          <AuthoringButton
            onClick={onAddHint}
            style={{ marginLeft: '22px' }}
            className="btn btn-sm btn-link"
          >
            Add cognitive hint
          </AuthoringButton>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex align-items-center">
            {'"Bottom out" hint'}
            <Tooltip title={'Explain the answer for students who are still lost'} />
          </div>
          <RichTextEditor
            placeholder="Explain how to solve the problem"
            style={{ backgroundColor: 'white' }}
            className="mb-2 flex-grow-1"
            text={bottomOutHint.content}
            onEdit={(content) => onEditHint(bottomOutHint.id, content)}
          />
        </div>
      </div>
    </div>
  );
};
