import React from 'react';

interface Props {
  onClick: () => void;
  hasMoreAttempts: boolean;
}
export const Reset = ({ onClick, hasMoreAttempts }: Props) => (
  <button disabled={!hasMoreAttempts} onClick={onClick} className="btn btn-sm btn-primary muted">
    Reset
  </button>
);
