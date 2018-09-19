// @flow

import * as React from 'react';
import Link from 'components/Link';

import Icon from 'components/Icon';
import IconPencil from 'images/sprite/pencil.svg';
import Dropdown from 'components/Dropdown';

import './styles.scss';

type Props = {
  data: Object,
  logout: Function,
};

const UserDropdown = ({ data, logout }: Props) => (
  <Dropdown
    dropdownContent={
      <ul className="userDropdown__menu hide-for-small-only">
        <li className="userDropdown__menuItem">
          <Link to="/me" className="userDropdown__username">
            <div className="row align-middle">
              <div className="shrink column npr">{data.get('username')}</div>
              <div className="shrink column npl">
                <Icon
                  glyph={IconPencil}
                  size={12}
                  className="userDropdown__editIcon"
                />
              </div>
            </div>
          </Link>
          <div>Reputation {data.get('reputation')}</div>
        </li>
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" to="/me">
            My Profile
          </Link>
        </li>
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" to="/me/rewards">
            My Rewards
          </Link>
        </li>
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" to="/me/reviews">
            My Reviews
          </Link>
        </li>
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" to="/create-review">
            Create a Review
          </Link>
        </li>
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" to="/change-password">
            Change Password
          </Link>
        </li>
        <li className="userDropdown__menuItem">
          <div className="userDropdown__menuItemContainer">
            <Link className="userDropdown__menuLink" onClick={() => logout()}>
              Logout
            </Link>
          </div>
        </li>
      </ul>
    }
    closeOnClickOutside
    dropdownPosition="bottom"
  >
    <div className="userDropdown hide-for-small-only">
      <div
        className="userDropdown__avatar"
        style={{ backgroundImage: `url(${data.get('picture')})` }}
      />
      <div className="userDropdown__points">
        <strong>{data.getIn(['pointWallet', 'balance'], 0)}</strong> lift points
      </div>
    </div>
  </Dropdown>
);

export default UserDropdown;
