// @flow

import * as React from 'react';
import Link from 'components/Link';

import './styles.scss';

type Props = {
  closeNavbar: Function,
};

const SecondaryMenu = ({ closeNavbar }: Props) => (
  <ul className="secondaryMenu">
    <li
      className="secondaryMenu__item"
      onClick={() => closeNavbar()}
      role="button"
    >
      <a
        className="secondaryMenu__link"
        href="https://liftco.freshdesk.com/support/home"
        target="_blank"
      >
        FAQ
      </a>
    </li>
    <li
      className="secondaryMenu__item"
      onClick={() => closeNavbar()}
      role="button"
    >
      <a
        className="secondaryMenu__link"
        href="https://investors.lift.co"
        target="_blank"
      >
        Investors
      </a>
    </li>
    <li
      className="secondaryMenu__item"
      onClick={() => closeNavbar()}
      role="button"
    >
      <Link className="secondaryMenu__link" to="/forum">
        Forum
      </Link>
    </li>
  </ul>
);

export default SecondaryMenu;
