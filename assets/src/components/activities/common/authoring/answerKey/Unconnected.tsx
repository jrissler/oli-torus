import React, { useMemo } from 'react';
import { defaultWriterContext } from 'data/content/writers/context';
import { Choices } from '../../choices';
import { Stem } from '../../stem';
import { IStem } from '../../stem/types';
import { IChoice } from '../../choices/types';
import { ChoiceId } from 'components/activities/types';

interface Props {
  stem: IStem;
  choices: IChoice[];
  correctChoiceIds: ChoiceId[];
  onToggleCorrectness: (id: ChoiceId) => void;
}
export const Unconnected: React.FC<Props> = ({
  stem,
  choices,
  correctChoiceIds,
  onToggleCorrectness,
}) => {
  const context = useMemo(defaultWriterContext, []);
  return (
    <>
      <Stem.Delivery stem={stem} context={context} />

      <Choices.Delivery
        unselectedIcon={<i className="material-icons-outlined">check_box_outline_blank</i>}
        selectedIcon={<i className="material-icons-outlined">check_box</i>}
        choices={choices}
        selected={correctChoiceIds}
        onSelect={onToggleCorrectness}
        isEvaluated={false}
        context={context}
      />
    </>
  );
};
