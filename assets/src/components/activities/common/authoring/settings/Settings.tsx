import { AuthoringButton } from 'components/misc/AuthoringButton';
import Popover from 'react-tiny-popover';
import React, { useState } from 'react';
import { classNames } from 'utils/classNames';
import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { IconCorrect } from 'components/misc/Icons';

interface SettingProps {
  isEnabled: boolean;
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
}
const Setting: React.FC<SettingProps> = ({ isEnabled, onToggle, children }) => {
  return (
    <button className="settings__open-button" onClick={onToggle}>
      <div className="settings__is-enabled">{isEnabled && <IconCorrect />}</div>
      <div className="settings__label">{children}</div>
    </button>
  );
};

interface MenuProps {
  children: React.ReactElement<SettingProps>[];
}
const Menu: React.FC<MenuProps> = ({ children }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { editMode } = useAuthoringElementContext();

  return (
    <AuthoringButton
      className={classNames([editMode ? '' : 'disabled'])}
      onClick={() => setIsPopoverOpen((isOpen) => !isOpen)}
    >Text
      {/* <Popover
        containerClassName="add-resource-popover"
        onClickOutside={() => setIsPopoverOpen(false)}
        isOpen={isPopoverOpen}
        align="end"
        transitionDuration={0}
        position={['left']}
        content={<div className="settings__menu">{children}</div>}
      >
        {(ref) => (
          <div ref={ref} className="insert-button">
            <i className="material-icons-outlined">more_vert</i>
          </div>
        )}
      </Popover> */}
    </AuthoringButton>
  );
};

export const Settings = {
  Menu,
  Setting,
};
