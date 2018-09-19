// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import DropdownMenu from 'components/DropdownMenu';

import './styles.scss';

type Props = {
  className?: string,
  toggle: any,
  children: any,
};

class NewsDropdownMenu extends Component<Props, Object> {
  static defaultProps = {
    dropdownLabel: 'Section',
  };

  render() {
    const { className, toggle, children } = this.props;

    const mergedClassName = cx('newsDropdownMenu', className);
    return (
      <DropdownMenu
        toggle={toggle}
        isOpen
        close={() => {}}
        textAlign="left"
        menuAlign="left"
        size="sm"
        className={mergedClassName}
      >
        {children}
      </DropdownMenu>
    );
  }
}

export default NewsDropdownMenu;
