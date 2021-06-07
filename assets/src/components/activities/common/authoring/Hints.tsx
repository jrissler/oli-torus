import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RichText, HasHints, HintId, Hint } from '../../types';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { Card } from 'components/activities/common/authoring/Card';
import { Tooltip } from 'components/activities/common/authoring/Tooltip';
import { makeHint } from './utils';
import { connect } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HintsProps {
  hints: Hint[];
  onAddHint: () => void;
  onEditHintContent: (id: HintId, content: RichText) => void;
  onRemoveHint: (id: HintId) => void;
}

export const AuthoringHints: React.FC<HintsProps> = ({
  hints,
  onAddHint,
  onEditHintContent,
  onRemoveHint,
}) => {
  const deerInHeadlightsHint = hints[0];
  const bottomOutHint = hints[hints.length - 1];
  const cognitiveHints = hints.slice(1, hints.length - 1);

  const HintCard: React.FC<{
    title: JSX.Element;
    placeholder: string;
    hint: Hint;
  }> = ({ title, placeholder, hint }) => {
    return (
      <Card.Card>
        <Card.Title>{title}</Card.Title>
        <Card.Content>
          <RichTextEditor
            placeholder={placeholder}
            style={{ backgroundColor: 'white' }}
            text={hint.content}
            onEdit={(content) => onEditHintContent(hint.id, content)}
          />
        </Card.Content>
      </Card.Card>
    );
  };

  const DeerInHeadlightsHint = () => (
    <HintCard
      title={
        <>
          {'"Deer in headlights" hint'}
          <Tooltip title={'Restate the question for students who are totally confused'} />
        </>
      }
      placeholder="Restate the question"
      hint={deerInHeadlightsHint}
    />
  );

  const CognitiveHints = () => (
    <Card.Card>
      <Card.Title>
        {'"Cognitive" hints'}
        <Tooltip title={'Explain how to solve the problem'} />
      </Card.Title>
      <Card.Content>
        {cognitiveHints.map((hint, index) => (
          <div key={hint.id} className="d-flex">
            <span className="mr-3 mt-2">{index + 1}.</span>
            <RichTextEditor
              placeholder="Explain how to solve the problem"
              style={{ backgroundColor: 'white' }}
              className="mb-2 flex-grow-1"
              text={hint.content}
              onEdit={(content) => onEditHintContent(hint.id, content)}
            />
            <div className="d-flex align-items-stretch">
              {index > 0 && <RemoveButton onClick={() => onRemoveHint(hint.id)} />}
            </div>
          </div>
        ))}
        <AuthoringButton
          onClick={() => onAddHint()}
          style={{ marginLeft: '22px' }}
          className="btn btn-sm btn-link"
        >
          Add cognitive hint
        </AuthoringButton>
      </Card.Content>
    </Card.Card>
  );

  const BottomOutHint = () => (
    <HintCard
      title={
        <>
          {'"Bottom out" hint'}
          <Tooltip title={'Explain the answer for students who are still lost'} />
        </>
      }
      placeholder="Explain how to solve the problem"
      hint={bottomOutHint}
    />
  );

  return (
    <>
      <DeerInHeadlightsHint />
      <CognitiveHints />
      <BottomOutHint />
    </>
  );
};