import React, { ReactNode } from 'react';

interface TabProps {
  label: string;
  index?: number;
  children: ReactNode;
}
const TabComponent: React.FunctionComponent<TabProps> = ({ index, children }) => (
  <div
    className={'tab-pane' + (index === 0 ? ' show active' : '')}
    id={'tab-' + index}
    role="tabpanel"
    aria-labelledby={'tab-' + index}
  >
    {children}
  </div>
);

interface TabsProps {
  children: React.ReactElement<TabProps>[];
}
const TabsComponent: React.FunctionComponent<TabsProps> = ({ children }) => {
  return (
    <>
      <ul className="nav nav-tabs" id="activity-authoring-tabs" role="tablist">
        {children.map(({ props: { label } }, index) => (
          <li key={label} className="nav-item" role="presentation">
            <a
              className={'nav-link' + (index === 0 ? ' active' : '')}
              id={'link-tab-' + index}
              data-toggle="tab"
              href={'#tab-' + index}
              role="tab"
              aria-controls={'tab-' + index}
              aria-selected="true"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {children.map((child, index) => React.cloneElement(child, { index }))}
      </div>
    </>
  );
};

export const Panels = { Tabs: TabsComponent, Tab: TabComponent };
