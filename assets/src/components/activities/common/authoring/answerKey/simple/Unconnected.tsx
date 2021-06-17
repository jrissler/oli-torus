import React, { useMemo } from 'react';
import { defaultWriterContext } from 'data/content/writers/context';
import { Choices } from '../../../choices';
import { Stem } from '../../../stem';
import { IStem } from '../../../stem/types';
import { IChoice } from '../../../choices/types';
import { ChoiceId } from 'components/activities/types';
import { Checkbox } from '../../icons/Checkbox';

interface Props {
  stem: IStem;
  choices: IChoice[];
  selectedChoiceIds: ChoiceId[];
  onSelectChoiceId: (id: ChoiceId) => void;
}
export const Unconnected: React.FC<Props> = ({
  stem,
  choices,
  selectedChoiceIds,
  onSelectChoiceId,
}) => {
  const context = useMemo(defaultWriterContext, []);
  return (
    <>
      <div className="d-flex">
        <Stem.Delivery stem={stem} context={context} />
        {/* TODO: Add Points here */}
      </div>

      <Choices.Delivery
        unselectedIcon={<Checkbox.Unchecked />}
        selectedIcon={<Checkbox.Unchecked />}
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
