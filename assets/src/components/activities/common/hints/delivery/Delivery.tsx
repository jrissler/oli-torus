import React from 'react';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import { WriterContext } from 'data/content/writers/context';
import { IHint } from '../types';
import { Card } from 'components/common/Card';

interface DisplayedHintProps {
  hint: IHint;
  context: WriterContext;
  index: number;
}

const DisplayedHint = ({ hint, context, index }: DisplayedHintProps) => {
  return (
    <div key={hint.id} aria-label={`hint ${index + 1}`} className="hint mb-2 d-flex">
      <i className="fas fa-lightbulb"></i>
      <div className="flex-fill ml-2">
        <HtmlContentModelRenderer text={hint.content} context={context} />
      </div>
    </div>
  );
};

interface HintsProps {
  isEvaluated: boolean;
  hints: IHint[];
  hasMoreHints: boolean;
  context: WriterContext;
  onClick: () => void;
  shouldShow?: boolean;
}

// export const Delivery: React.FC<HintsProps> = ({
//   isEvaluated,
//   hints,
//   hasMoreHints,
//   context,
//   onClick,
//   shouldShow = true,
// }) => {
//   if (!shouldShow) {
//     return null;
//   }

//   // Display nothing if the question has no hints, meaning no hints have been requested so far
//   // and there are no more available to be requested
//   const noHintsRequested = hints.length === 0;
//   if (noHintsRequested && !hasMoreHints) {
//     return null;
//   }

//   return (
//     <div className="hints my-2">
//       <div className="hints-adornment"></div>
//       <h6>Hints</h6>
//       <div className="hints-list">
//         {hints.map((hint, index) => (
//           <DisplayedHint index={index} key={hint.id} hint={hint} context={context} />
//         ))}
//       </div>
//       {hasMoreHints && (
//         <button
//           aria-label="request hint"
//           onClick={onClick}
//           disabled={isEvaluated || !hasMoreHints}
//           className="btn btn-sm btn-primary muted mt-2"
//         >
//           Request Hint
//         </button>
//       )}
//     </div>
//   );
// };

export const Delivery: React.FC<HintsProps> = ({
  isEvaluated,
  hints,
  hasMoreHints,
  context,
  onClick,
  shouldShow = true,
}) => {
  if (!shouldShow) {
    return null;
  }
  // Display nothing if the question has no hints, meaning no hints have been requested so far
  // and there are no more available to be requested
  const noHintsRequested = hints.length === 0;
  if (noHintsRequested && !hasMoreHints) {
    return null;
  }
  return (
    <Card.Card>
      <Card.Title>Hints</Card.Title>
      <Card.Content>
        {hints.map((hint, index) => (
          <div key={hint.id} className="d-flex align-items-center mb-2">
            <span className="mr-2">{index + 1}.</span>
            <HtmlContentModelRenderer text={hint.content} context={context} />
          </div>
        ))}
        {hasMoreHints && (
          <button
            aria-label="request hint"
            onClick={onClick}
            disabled={isEvaluated || !hasMoreHints}
            className="btn btn-sm btn-link"
            style={{ padding: 0 }}
          >
            Request Hint
          </button>
        )}
      </Card.Content>
    </Card.Card>
  );
};
