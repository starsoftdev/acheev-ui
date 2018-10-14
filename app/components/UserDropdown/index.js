// @flow

import * as React from 'react';
import Link from 'components/Link';

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
          <Link className="userDropdown__menuLink" to="/me">
            My Profile
          </Link>
        </li>
        <li className="userDropdown__menuItemDivider" />
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" to="/">
            Settings
          </Link>
        </li>
        <li className="userDropdown__menuItemDivider" />
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" to="/dashboard">
            My Dashboard
          </Link>
        </li>
        <li className="userDropdown__menuItemDivider" />
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" to="/">
            Orders
          </Link>
        </li>
        <li className="userDropdown__menuItemDivider" />
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" to="/">
            Courses
          </Link>
        </li>
        <li className="userDropdown__menuItemDivider" />
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" to="/">
            Refer
          </Link>
        </li>
        <li className="userDropdown__menuItemDivider" />
        <li className="userDropdown__menuItem">
          <Link className="userDropdown__menuLink" onClick={() => logout()}>
            Logout
          </Link>
        </li>
      </ul>
    }
    closeOnClickOutside
    dropdownPosition="bottom"
  >
    <div className="userDropdown hide-for-small-only">
      <div
        className="userDropdown__avatar"
        style={{
          backgroundImage: `url(${data.getIn(['image', 'src'])})`,
        }}
      />
    </div>
  </Dropdown>
);

export default UserDropdown;
