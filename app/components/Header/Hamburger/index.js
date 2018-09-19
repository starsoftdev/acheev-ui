// @flow

import * as React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  closeNavbar?: Function,
  openNavbar?: Function,
  isActive: boolean,
  onClick?: Function,
};

const Hamburger = ({ closeNavbar, openNavbar, isActive, onClick }: Props) => {
  const className = cx('hamburger', { 'hamburger--active': isActive });
  return (
    <div
      className={className}
      onClick={() => {
        if (onClick) onClick();
        if (closeNavbar && openNavbar) {
          if (isActive) {
            closeNavbar();
          } else {
            openNavbar();
          }
        }
      }}
      role="button"
    >
      <span className="hamburger__inner" />
      <span className="hamburger__inner" />
      <span className="hamburger__inner" />
    </div>
  );
};

export default Hamburger;
