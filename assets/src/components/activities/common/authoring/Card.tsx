import React from 'react';

interface Props {
  title?: JSX.Element | string;
  content?: JSX.Element | string;
}
export const Card: React.FC<Props> = ({ title, content }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-title d-flex align-items-center">{title}</div>
        {content}
      </div>
    </div>
  );
};
