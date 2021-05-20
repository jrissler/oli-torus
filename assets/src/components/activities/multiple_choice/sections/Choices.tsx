import React from 'react';
import { Heading } from 'components/misc/Heading';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { ModelEditorProps } from '../schema';
import { RichText } from '../../types';
import { Description } from 'components/misc/Description';
import { IconCorrect, IconIncorrect } from 'components/misc/Icons';
import { ProjectSlug } from 'data/types';
import * as Lang from 'utils/lang';
<<<<<<< HEAD
import { correctChoice, incorrectChoices } from 'components/activities/multiple_choice/utils';
import { RemoveButton } from 'components/misc/RemoveButton';
import { AuthoringButton } from 'components/misc/AuthoringButton';
=======
import { ShuffleChoicesOption } from 'components/activities/common/utils';
>>>>>>> 7a3c8771a70ea05211cabad4ff92582849b55004

interface ChoicesProps {
  onAddChoice: () => void;
  onEditChoice: (id: string, content: RichText) => void;
  onRemoveChoice: (id: string) => void;
  projectSlug: ProjectSlug;
<<<<<<< HEAD
  onToggleAnswerChoiceShuffling: () => void;
  isShuffled: boolean;
  model: any;
=======
  onShuffle: () => void;
>>>>>>> 7a3c8771a70ea05211cabad4ff92582849b55004
}
export const Choices = ({
  onAddChoice,
  onEditChoice,
  onRemoveChoice,
  onToggleAnswerChoiceShuffling,
  isShuffled,
  model,
<<<<<<< HEAD
=======
  projectSlug,
  onShuffle,
>>>>>>> 7a3c8771a70ea05211cabad4ff92582849b55004
}: ChoicesProps) => {
  return (
    <div className="my-5">
      <Heading
        title={Lang.dgettext('mcq', 'Answer Choices')}
        subtitle={Lang.dgettext(
          'mcq',
          'One correct answer choice and as many incorrect answer choices as you like.',
        )}
        id="choices"
      />
<<<<<<< HEAD
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="checkbox-shuffle-choices"
          checked={isShuffled}
          onChange={() => onToggleAnswerChoiceShuffling()}
        />
        <label className="form-check-label" htmlFor="flexCheckChecked">
          Shuffle answer choices
        </label>
      </div>
=======

      <ShuffleChoicesOption onShuffle={onShuffle} model={model} />

>>>>>>> 7a3c8771a70ea05211cabad4ff92582849b55004
      <Description>
        <IconCorrect /> {Lang.dgettext('mcq', 'Correct Choice')}
      </Description>
      <RichTextEditor
        className="mb-3"
        key="correct"
        text={correctChoice(model).content}
        onEdit={(content) => onEditChoice(correctChoice(model).id, content)}
      />
      {incorrectChoices(model).map((choice, index) => (
        <React.Fragment key={choice.id}>
          <Description>
            <IconIncorrect /> {Lang.dgettext('mcq', 'Incorrect Choice')} {index + 1}
          </Description>
          <div className="d-flex mb-3">
            <RichTextEditor
              className="flex-fill"
              text={choice.content}
              onEdit={(content) => onEditChoice(choice.id, content)}
            />
            <RemoveButton onClick={() => onRemoveChoice(choice.id)} />
          </div>
        </React.Fragment>
      ))}
      <AuthoringButton className="btn btn-sm btn-primary my-2" onClick={onAddChoice}>
        {Lang.dgettext('mcq', 'Add incorrect answer choice')}
      </AuthoringButton>
    </div>
  );
};
