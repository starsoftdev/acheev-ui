// @flow

import * as React from 'react';
import cx from 'classnames';

import MENU_ITEMS from 'enum/menu/items';

import MainMenu from 'components/Header/MainMenu';
import Link from 'components/Link';
import Icon from 'components/Icon';
import Hamburger from 'components/Header/Hamburger';

import Logo from 'images/sprite/logo-lp.svg';

import './styles.scss';

type Props = {
  user: Object,
  logout: Function,
  replace: Function,
  pathname: string,
};

type State = {
  isOpen: boolean,
};

class LpHeader extends React.Component<Props, State> {
  state = {
    isOpen: false,
  };
  componentWillReceiveProps({ user, replace }: Props) {
    if (this.props.user && !user) {
      replace('/lp/login');
    }
  }
  render() {
    const { user, logout, pathname } = this.props;
    const className = cx('lpHeader', { open: this.state.isOpen });
    return (
      <div className={className}>
        <div className="row align-middle">
          <div className="small-12 medium-expand column">
            <div className="row">
              <div className="lpHeader__topLine medium-shrink column order-1">
                <Link to="/">
                  <Icon
                    className="lpHeader__logo"
                    glyph={Logo}
                    width={50}
                    height={31}
                  />
                </Link>
              </div>
              {user && (
                <div className="lpHeader__user lpHeader__toggle small-12 medium-shrink column order-2 small-order-3">
                  Welcome back,{' '}
                  <span className="c-secondary">{user.get('username')}</span>
                  <br />
                  <Link className="lpHeader__link" onClick={() => logout('lp')}>
                    Log out
                  </Link>
                </div>
              )}
              <div className="lpHeader__topLine hide-for-medium shrink column order-3 small-order-2">
                <Hamburger
                  isActive={this.state.isOpen}
                  onClick={() => this.setState({ isOpen: !this.state.isOpen })}
                />
              </div>
            </div>
          </div>
          <div className="lpHeader__menu lpHeader__toggle small-12 medium-shrink column">
            <MainMenu items={MENU_ITEMS.LP_MENU_ITEMS} pathname={pathname} />
          </div>
        </div>
      </div>
    );
  }
}

export default LpHeader;
