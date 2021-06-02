import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { RichText, HasHints, HintId } from '../../types';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import { Card } from 'components/activities/common/authoring/Card';
import { Tooltip } from 'components/activities/common/authoring/Tooltip';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import produce from 'immer';
import { getHint, getHints, makeHint } from './utils';

interface HintsProps {
  onAddHint?: () => void;
  onEditHintContent?: (id: HintId, content: RichText) => void;
  onRemoveHint?: (id: HintId) => void;
}

export const useHints = () => {
  const { model, dispatch } = useAuthoringElementContext<HasHints>();

  const hints = getHints(model);
  const deerInHeadlightsHint = hints[0];
  const bottomOutHint = hints[hints.length - 1];
  const cognitiveHints = hints.slice(1, hints.length - 1);

  const addHint = () =>
    produce((draft) => {
      const newHint = makeHint('');
      // new hints are always cognitive hints. they should be inserted
      // right before the bottomOut hint at the end of the list
      const bottomOutIndex = getHints(draft).length - 1;
      getHints(draft).splice(bottomOutIndex, 0, newHint);
    });

  const editHintContent = (id: HintId, content: RichText) =>
    produce((draft) => void (getHint(draft, id).content = content));

  const removeHint = (id: HintId) =>
    produce(
      (draft) => void (draft.authoring.parts[0].hints = getHints(draft).filter((h) => h.id !== id)),
    );

  return {
    hints,
    deerInHeadlightsHint,
    bottomOutHint,
    cognitiveHints,
    addHint,
    editHintContent,
    removeHint,
    dispatch,
  };
};

export const Hints = (props: HintsProps) => {
  const { onAddHint, onEditHintContent, onRemoveHint } = props;
  const {
    deerInHeadlightsHint,
    bottomOutHint,
    cognitiveHints,
    addHint,
    editHintContent,
    removeHint,
    dispatch,
  } = useHints();

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
            onEdit={(content) =>
              onEditHintContent
                ? onEditHintContent(deerInHeadlightsHint.id, content)
                : dispatch(editHintContent(deerInHeadlightsHint.id, content))
            }
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
                  onEdit={(content) =>
                    onEditHintContent
                      ? onEditHintContent(hint.id, content)
                      : dispatch(editHintContent(hint.id, content))
                  }
                />
                <div className="d-flex align-items-stretch">
                  {index > 0 && (
                    <RemoveButton
                      onClick={() =>
                        onRemoveHint ? onRemoveHint(hint.id) : dispatch(removeHint(hint.id))
                      }
                    />
                  )}
                </div>
              </div>
            ))}
            <AuthoringButton
              onClick={() => (onAddHint ? onAddHint() : dispatch(addHint()))}
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
            onEdit={(content) =>
              onEditHintContent
                ? onEditHintContent(bottomOutHint.id, content)
                : dispatch(editHintContent(bottomOutHint.id, content))
            }
          />
        }
      />
    </>
  );
};
