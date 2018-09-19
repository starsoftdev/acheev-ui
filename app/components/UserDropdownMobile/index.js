// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import Link from 'components/Link';
import cx from 'classnames';

import Icon from 'components/Icon';
import IconPencil from 'images/sprite/pencil.svg';
import IconClose from 'images/sprite/close.svg';

import './styles.scss';

type Props = {
  data: Object,
  logout: Function,
  closeNavbar: Function,
};

const userMenuData = [
  {
    label: 'My Profile',
    title: '/me',
  },
  {
    label: 'My Rewards',
    title: '/me/rewards',
  },
  {
    label: 'My Reviews',
    title: '/me/reviews',
  },
  {
    label: 'Create a Review',
    title: '/create-review',
  },
  {
    label: 'Change Password',
    title: '/change-password',
  },
];

class UserDropdownMobile extends Component<
  Props,
  {
    isOpen: boolean,
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  toggleMenu = () => {
    this.props.closeNavbar();
    this.setState({ isOpen: !this.state.isOpen });
  };
  render() {
    const { data, logout } = this.props;
    const className = cx('userDropdownMobile__menu', {
      isOpen: this.state.isOpen,
    });
    return (
      <div className="userDropdownMobile text-left show-for-small-only">
        <Link className="userDropdownMobile" onClick={this.toggleMenu}>
          <div
            className="userDropdownMobile__avatar userDropdownMobile__avatar--toggle"
            style={{ backgroundImage: `url(${data.get('picture')})` }}
          />
        </Link>
        <ul className={className}>
          <li className="userDropdownMobile__menuItem">
            <div className="row align-middle">
              <div className="shrink column">
                <div
                  className="userDropdownMobile__avatar"
                  style={{ backgroundImage: `url(${data.get('picture')})` }}
                />
              </div>
              <div className="column">
                <div className="row align-middle">
                  <div className="userDropdownMobile__username shrink column npr">
                    {data.get('username')}
                  </div>
                  <div className="column">
                    <Link to="/me" onClick={this.toggleMenu}>
                      <Icon
                        glyph={IconPencil}
                        size={12}
                        className="userDropdownMobile__editIcon"
                      />
                    </Link>
                  </div>
                </div>
                <div className="userDropdownMobile__reputation">
                  Reputation {data.get('reputation')}
                </div>
              </div>
            </div>
          </li>
          <li className="userDropdownMobile__menuItem userDropdownMobile__menuItem--points">
            <strong>
              {data.getIn(['pointWallet', 'balance'], 0)}
            </strong>&nbsp;lift points
          </li>
          <Icon
            className="userDropdownMobile__closeIcon"
            glyph={IconClose}
            size={10}
            onClick={this.toggleMenu}
          />
          {userMenuData.map(value => (
            <li key={generate()} className="userDropdownMobile__menuItem">
              <Link
                className="userDropdownMobile__menuLink"
                to={value.title}
                onClick={this.toggleMenu}
              >
                {value.label}
              </Link>
            </li>
          ))}
          <li className="userDropdownMobile__menuItem">
            <Link
              className="userDropdownMobile__menuLink"
              onClick={() => logout()}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default UserDropdownMobile;
