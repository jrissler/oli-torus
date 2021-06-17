import { useActivityContext } from 'components/activities/ActivityContext';
import React, { MouseEventHandler } from 'react';
import { classNames } from 'utils/classNames';

export type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

export const AuthoringButton: React.FC<Props> = (props: Props) => {
  const { editMode } = useActivityContext();

  return (
    <button
      style={props.style}
      className={classNames(['btn', props.className])}
      disabled={props.disabled || !editMode}
      type="button"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
