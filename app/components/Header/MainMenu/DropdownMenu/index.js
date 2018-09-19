// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import cx from 'classnames';

import Link from 'components/Link';
import DropdownMenu from 'components/DropdownMenu';
import MenuItem from 'components/Header/MainMenu/MenuItem';

import './styles.scss';

type Props = {
  data: Array<Object>,
  text: string,
  link: string,
  className?: string,
};

class HeaderDropdownMenu extends Component<Props, Object> {
  constructor() {
    super();
    this.state = {
      isMenuOpen: false,
    };
  }

  render() {
    const { data, text, link, className } = this.props;
    const mergedClassName = cx('headerDropdownMenu', className);
    return (
      <DropdownMenu
        toggle={
          <MenuItem
            onClick={() =>
              this.setState({ isMenuOpen: !this.state.isMenuOpen })}
            text={text}
            link={link}
            containerClassName={false}
          />
        }
        isOpen={this.state.isMenuOpen}
        close={() => this.setState({ isMenuOpen: false })}
        textAlign="left"
        menuAlign="left"
        size="sm"
        className={mergedClassName}
      >
        {data.map(({ link: itemLink, text: itemText }) => (
          <li key={generate()}>
            <Link
              to={itemLink}
              className="headerDropdownMenu__link"
              activeClassName="headerDropdownMenu__link--active"
            >
              {itemText}
            </Link>
          </li>
        ))}
      </DropdownMenu>
    );
  }
}

export default HeaderDropdownMenu;
