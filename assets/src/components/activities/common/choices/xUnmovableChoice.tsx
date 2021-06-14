import { RichText } from 'components/activities/types';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { Description } from 'components/misc/Description';
import { IconCorrect, IconIncorrect } from 'components/misc/Icons';
import { RemoveButton } from 'components/misc/RemoveButton';
import React from 'react';
import {  IChoice  } from './types';;

interface Props {
  choice: IChoice;
  isCorrectChoice: (id: string) => boolean;
  index: number;
  onEditChoice: (id: string, content: RichText) => void;
  onRemoveChoice: (id: string) => void;
  canRemoveChoice: (id: string) => boolean;
}
export const UnmovableChoice = ({
  choice,
  isCorrectChoice,
  index,
  onEditChoice,
  onRemoveChoice,
  canRemoveChoice,
}: Props) => {
  const label = isCorrectChoice(choice.id) ? (
    <>
      <IconCorrect /> Correct Choice
    </>
  ) : (
    <>
      <IconIncorrect /> Incorrect Choice {index + 1}
    </>
  );

  <React.Fragment key={choice.id}>
    <Description>{label}</Description>
    <div className="d-flex mb-3">
      <RichTextEditor
        className="flex-fill"
        text={choice.content}
        onEdit={(content) => onEditChoice(choice.id, content)}
      />
      {canRemoveChoice(choice.id) && <RemoveButton onClick={() => onRemoveChoice(choice.id)} />}
    </div>
  </React.Fragment>;
};
