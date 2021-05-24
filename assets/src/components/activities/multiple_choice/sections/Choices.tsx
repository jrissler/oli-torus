import React from 'react';
import { Heading } from 'components/misc/Heading';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { ModelEditorProps } from '../schema';
import { RichText } from '../../types';
import { Description } from 'components/misc/Description';
import { IconCorrect, IconIncorrect } from 'components/misc/Icons';
import { ProjectSlug } from 'data/types';
import * as Lang from 'utils/lang';
import { ShuffleChoicesOption } from 'components/activities/common/utils';

interface ChoicesProps {
  onAddChoice: () => void;
  onEditChoice: (id: string, content: RichText) => void;
  onRemoveChoice: (id: string) => void;
  projectSlug: ProjectSlug;
  onShuffle: () => void;
}
export const Choices = ({
  onAddChoice,
  onEditChoice,
  onRemoveChoice,

  onShuffle,
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

      <ShuffleChoicesOption onShuffle={onShuffle} model={model} />

      <Description>
        <IconCorrect /> {Lang.dgettext('mcq', 'Correct Choice')}
      </Description>
      <RichTextEditor
        className="mb-3"
        key="correct"
        text={correctChoice(model).content}
        onEdit={(content) => onEditChoice(correctChoice(model).id, content)}
      />
      {/* {incorrectChoices(model).map((choice, index) => (
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
      </AuthoringButton> */}
    </div>
  );
};
