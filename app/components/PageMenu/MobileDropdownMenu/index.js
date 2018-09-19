// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import type { Map, List } from 'immutable';

import Icon from 'components/Icon';
import DropdownMenu from 'components/DropdownMenu';
import Link from 'components/Link';

import ChevronDown from 'images/sprite/chevron-down.svg';

import './styles.scss';

type Props = {
  data: List<Map<string, *>>,
  className?: string,
  linkPrefix?: string,
  dropdownLabel?: string,
  location: Object,
  titlePath?: Array<string>,
  slugPath?: Array<string>,
};

class mobileDropdownMenu extends Component<Props, Object> {
  static defaultProps = {
    dropdownLabel: 'Section',
    slugPath: ['link'],
    titlePath: ['name'],
  };

  state = {
    isMenuOpen: false,
  };

  render() {
    const {
      data,
      className,
      linkPrefix,
      dropdownLabel,
      location,
      titlePath,
      slugPath,
    } = this.props;

    if (!data || !location) return null;

    const mergedClassName = cx('magazineMobileDropdownMenu', className);
    const chevronClassName = cx('magazineMobileDropdownMenu__chevron', {
      'magazineMobileDropdownMenu__chevron--open': this.state.isMenuOpen,
    });
    const index = data.findIndex(
      item => item.get('link') === location.pathname
    );
    const finalDropdownLabel =
      index !== -1 ? data.getIn([index, 'name']) : dropdownLabel;
    return (
      <DropdownMenu
        toggle={
          <div
            className="magazineMobileDropdownMenu__current"
            onClick={() =>
              this.setState({ isMenuOpen: !this.state.isMenuOpen })}
            role="button"
          >
            <div className="row align-middle">
              <div className="column">{finalDropdownLabel}</div>
              <div className="shrink column">
                <Icon className={chevronClassName} glyph={ChevronDown} />
              </div>
            </div>
          </div>
        }
        isOpen={this.state.isMenuOpen}
        close={() => this.setState({ isMenuOpen: false })}
        textAlign="left"
        menuAlign="left"
        size="sm"
        className={mergedClassName}
      >
        {data &&
          data.map(item => (
            <Link
              className="magazineMobileDropdownMenu__link"
              activeClassName="magazineMobileDropdownMenu__link--active"
              to={`${linkPrefix}${item.getIn(slugPath)}`}
              key={generate()}
              exact
            >
              {item.getIn(titlePath)}
            </Link>
          ))}
      </DropdownMenu>
    );
  }
}

export default mobileDropdownMenu;
