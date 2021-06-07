import { AuthoringButton } from 'components/misc/AuthoringButton';
import { Popover } from 'react-tiny-popover';
import React, { useState } from 'react';
import { classNames } from 'utils/classNames';
import { IconCorrect } from 'components/misc/Icons';
import './Settings.scss';
import { useActivityContext } from 'components/activities/check_all_that_apply/CheckAllThatApplyAuthoring';

interface SettingProps {
  isEnabled: boolean;
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
}
const Setting: React.FC<SettingProps> = ({ isEnabled, onToggle, children }) => {
  return (
    <button className="settings__setting-button" onClick={onToggle}>
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
  const { editMode } = useActivityContext();

  return (
    <AuthoringButton
      className={classNames(['settings__open-button', editMode ? '' : 'disabled'])}
      onClick={() => setIsPopoverOpen((isOpen) => !isOpen)}
    >
      <Popover
        containerClassName="add-resource-popover"
        onClickOutside={() => setIsPopoverOpen(false)}
        isOpen={isPopoverOpen}
        align="end"
        positions={['left']}
        content={<div className="settings__menu">{children}</div>}
      >
        <i className="material-icons-outlined">more_vert</i>
      </Popover>
    </AuthoringButton>
  );
};

export const Settings = {
  Menu,
  Setting,
};
