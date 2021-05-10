import { AuthoringButton } from 'components/misc/AuthoringButton';
import React, { MouseEventHandler } from 'react';

export type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export const RemoveButton = (props: Props) => (
  <AuthoringButton onClick={props.onClick} className="RemoveButton p-0">
    <i
      style={{
        cursor: 'default',
        pointerEvents: 'none',
      }}
      className="material-icons-outlined"
    >
      close
    </i>
  </AuthoringButton>
);
