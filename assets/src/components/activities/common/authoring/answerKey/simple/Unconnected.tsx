import React, { useMemo } from 'react';
import { defaultWriterContext } from 'data/content/writers/context';
import { Choices } from '../../../choices';
import { Stem } from '../../../stem';
import { ChoiceId } from 'data/content/activities/activity';
import { IStem } from 'data/content/activities/stem';
import { IChoice } from 'data/content/activities/choice';

interface Props {
  stem: IStem;
  choices: IChoice[];
  selectedChoiceIds: ChoiceId[];
  onSelectChoiceId: (id: ChoiceId) => void;
  selectedIcon: React.ReactNode;
  unselectedIcon: React.ReactNode;
}
export const Unconnected: React.FC<Props> = ({
  stem,
  choices,
  selectedChoiceIds,
  onSelectChoiceId,
  selectedIcon,
  unselectedIcon,
}) => {
  const context = useMemo(defaultWriterContext, []);
  return (
    <>
      <div className="d-flex">
        <Stem.Delivery stem={stem} context={context} />
        {/* TODO: Add Points here */}
      </div>

      <Choices.Delivery
        unselectedIcon={unselectedIcon}
        selectedIcon={selectedIcon}
        choices={choices}
        selected={selectedChoiceIds}
        onSelect={onSelectChoiceId}
        isEvaluated={false}
        context={context}
      />
    </>
  );
};
Unconnected.displayName = 'AnswerKeyAuthoringEditor';
