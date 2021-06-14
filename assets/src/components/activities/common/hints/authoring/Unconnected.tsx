import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RichText, HintId } from '../../../types';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { Card as CardComponent } from 'components/common/Card';
import { Tooltip } from 'components/activities/common/authoring/Tooltip';
import { IHint } from '../types';

export const Card: React.FC<{
  title: JSX.Element;
  placeholder: string;
  hint: IHint;
  updateOne: (id: HintId, content: RichText) => void;
}> = ({ title, placeholder, hint, updateOne }) => {
  return (
    <CardComponent.Card>
      <CardComponent.Title>{title}</CardComponent.Title>
      <CardComponent.Content>
        <RichTextEditor
          placeholder={placeholder}
          style={{ backgroundColor: 'white' }}
          text={hint.content}
          onEdit={(content) => updateOne(hint.id, content)}
        />
      </CardComponent.Content>
    </CardComponent.Card>
  );
};

interface HintProps {
  hint: IHint;
  updateOne: (id: HintId, content: RichText) => void;
}
const DeerInHeadlightsHint: React.FC<HintProps> = ({ hint, updateOne }) => (
  <Card
    title={
      <>
        {'"Deer in headlights" hint'}
        <Tooltip title={'Restate the question for students who are totally confused'} />
      </>
    }
    placeholder="Restate the question"
    hint={hint}
    updateOne={updateOne}
  />
);

const CognitiveHints = ({
  hints,
  updateOne,
  removeOne,
  addOne,
}: {
  hints: IHint[];
  updateOne: (id: HintId, content: RichText) => void;
  removeOne: any;
  addOne: any;
}) => (
  <CardComponent.Card>
    <CardComponent.Title>
      {'"Cognitive" hints'}
      <Tooltip title={'Explain how to solve the problem'} />
    </CardComponent.Title>
    <CardComponent.Content>
      {hints.map((hint, index) => (
        <div key={hint.id} className="d-flex">
          <span className="mr-3 mt-2">{index + 1}.</span>
          <RichTextEditor
            placeholder="Explain how to solve the problem"
            style={{ backgroundColor: 'white' }}
            className="mb-2 flex-grow-1"
            text={hint.content}
            onEdit={(content) => updateOne(hint.id, content)}
          />
          <div className="d-flex align-items-stretch">
            {index > 0 && <RemoveButton onClick={() => removeOne(hint.id)} />}
          </div>
        </div>
      ))}
      <AuthoringButton
        onClick={() => addOne()}
        style={{ marginLeft: '22px' }}
        className="btn btn-sm btn-link"
      >
        Add cognitive hint
      </AuthoringButton>
    </CardComponent.Content>
  </CardComponent.Card>
);

const BottomOutHint = ({ hint, updateOne }: { hint: IHint; updateOne: any }) => (
  <Card
    title={
      <>
        {'"Bottom out" hint'}
        <Tooltip title={'Explain the answer for students who are still lost'} />
      </>
    }
    placeholder="Explain how to solve the problem"
    hint={hint}
    updateOne={updateOne}
  />
);

interface HintsProps {
  addOne: () => void;
  updateOne: (id: HintId, content: RichText) => void;
  removeOne: (id: HintId) => void;
  deerInHeadlightsHint: IHint;
  cognitiveHints: IHint[];
  bottomOutHint: IHint;
}
export const Unconnected: React.FC<HintsProps> = ({
  deerInHeadlightsHint,
  cognitiveHints,
  bottomOutHint,
  addOne,
  updateOne,
  removeOne,
}) => {
  return (
    <>
      <DeerInHeadlightsHint hint={deerInHeadlightsHint} updateOne={updateOne} />
      <CognitiveHints
        hints={cognitiveHints}
        updateOne={updateOne}
        addOne={addOne}
        removeOne={removeOne}
      />
      <BottomOutHint hint={bottomOutHint} updateOne={updateOne} />
    </>
  );
};
