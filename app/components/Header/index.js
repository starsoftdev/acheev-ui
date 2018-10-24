// @flow

import * as React from 'react';
import Link from 'components/Link';
import cx from 'classnames';
import type { Map } from 'immutable';

// import MENU_ITEMS from 'enum/menu/items';

import { history } from 'components/ConnectedRouter';
import Button from 'components/Button';
import UserDropdown from 'components/UserDropdown';
import UserDropdownMobile from 'components/UserDropdownMobile';
import GlobalSearch from 'components/GlobalSearch';
import Icon from 'components/Icon';

import MessageInactiveIcon from 'images/sprite/message-inactive.svg';
import NotificationInactiveIcon from 'images/sprite/notification-inactive.svg';
import Logo from 'images/logo.png';

import MODAL from 'enum/modals';

// import MainMenu from './MainMenu';
// import SecondaryMenu from './SecondaryMenu';
import Hamburger from './Hamburger';

import './styles.scss';

type Props = {
  user: Object,
  logout: Function,
  replace: Function,
  navbarOpen: boolean,
  closeNavbar: Function,
  openNavbar: Function,
  requestGlobalSearch: Function,
  pathname: string,
  globalSearchFilter: Map<*, *>,
  globalSearchData: Map<string, Object>,
  isGlobalSearchLoading: boolean,
  openModal: Function,
  clearGlobalSearch: Function,
};

class Header extends React.Component<Props> {
  componentWillReceiveProps({ user, replace }: Props) {
    if (this.props.user && !user) {
      replace('/');
    }
  }
  render() {
    const {
      user,
      logout,
      replace,
      navbarOpen,
      closeNavbar,
      openNavbar,
      pathname,
      globalSearchFilter,
      globalSearchData,
      requestGlobalSearch,
      clearGlobalSearch,
      isGlobalSearchLoading,
    } = this.props;
    const className = cx('header', { navbarOpen });
    const authRoute =
      pathname.includes('login') || pathname.includes('register');
    return (
      <div className={className}>
        <div className="header__topLine row align-middle">
          <div className="small-order-2 shrink column">
            <Link to="/">
              <img //eslint-disable-line
                className="header__logo"
                src={Logo}
                alt="logo"
                onClick={() => closeNavbar()}
              />
              {/* <Icon
                glyph={Logo}
                width={100}
                height={35}
                className="header__logo"
                onClick={() => closeNavbar()}
              /> */}
            </Link>
          </div>
          {!authRoute && (
            <div className="small-order-1 shrink column hide-for-medium align-self-right">
              <Hamburger
                closeNavbar={closeNavbar}
                openNavbar={openNavbar}
                isActive={navbarOpen}
              />
            </div>
          )}
          {!authRoute && (
            <div className="small-order-3 medium-order-4 column text-right">
              {user ? (
                <div className="flex-container align-right">
                  <Button
                    className="small mr-mn"
                    element={Link}
                    to="/post-offer"
                  >
                    Post Offer
                  </Button>
                  <div className="header__btnIcon">
                    <Icon glyph={NotificationInactiveIcon} size={15} />
                  </div>
                  <div
                    className="header__btnIcon"
                    role="button"
                    onClick={() => history.push('/messages')}
                  >
                    <Icon glyph={MessageInactiveIcon} size={15} />
                  </div>
                  <UserDropdown data={user} logout={logout} replace={replace} />
                  <UserDropdownMobile
                    data={user}
                    logout={logout}
                    replace={replace}
                    closeNavbar={closeNavbar}
                    authRoute={authRoute}
                  />
                </div>
              ) : (
                <div className="text-right">
                  <Button
                    className="header__authBtn hollow"
                    element={Link}
                    onClick={() => this.props.openModal(MODAL.LOGIN_MODAL)}
                  >
                    Login
                  </Button>
                  <Button
                    className="header__authBtn ml-mn"
                    element={Link}
                    onClick={() => this.props.openModal(MODAL.REGISTER_MODAL)}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          )}

          {!authRoute && (
            <div className="small-order-6 medium-order-2 small-12 medium-expand column align-self-right hide-for-small-only">
              <GlobalSearch
                filter={globalSearchFilter}
                isLoading={isGlobalSearchLoading}
                data={globalSearchData}
                requestGlobalSearch={requestGlobalSearch}
                clearGlobalSearch={clearGlobalSearch}
              />
            </div>
          )}
        </div>
        {/* {!authRoute && (
          <div className="header__togglable row">
            <div className="header__mainMenuContainer small-12 medium-expand column">
              <MainMenu
                justified
                items={MENU_ITEMS.MAIN_MENU_ITEMS}
                globalSearchFilter={globalSearchFilter}
                isGlobalSearchLoading={isGlobalSearchLoading}
                globalSearchData={globalSearchData}
                requestGlobalSearch={requestGlobalSearch}
              />
            </div>
            <div className="header__secondaryMenuContainer small-12 medium-shrink column">
              <SecondaryMenu closeNavbar={closeNavbar} />
            </div>
          </div>
        )} */}
      </div>
    );
  }
}

export default Header;
