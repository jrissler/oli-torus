import { ChoiceId } from 'components/activities/types';
import { AuthoringButton } from 'components/misc/AuthoringButton';
import React from 'react';

interface Props {
  choiceId: ChoiceId;
  predicate: (choiceId: ChoiceId) => boolean;
  onClick: (choiceId: ChoiceId) => void;
  icon: string;
}
export const MoveButton = ({ choiceId, predicate, onClick, icon }: Props) => {
  // if (!predicate(choiceId)) {
  //   return <button className="btn p-0" style={{ height: '12px' }} disabled></button>;
  // }
  return (
    <AuthoringButton
      disabled={!predicate(choiceId)}
      className="btn p-0"
      style={{ height: '12px', border: 0 }}
      onClick={() => onClick(choiceId)}
    >
      <i
        style={{
          lineHeight: '12px',
        }}
        className="material-icons-outlined"
      >
        {icon}
      </i>
    </AuthoringButton>
  );
};
