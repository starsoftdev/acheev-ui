// @flow

import * as React from 'react';

import Icon from 'components/Icon';
import Link from 'components/Link';

import Logo from 'images/sprite/logo-white.svg';

import './styles.scss';

class MagazineBanner extends React.Component<{}> {
  render() {
    return (
      <div className="magazineBanner">
        <Icon glyph={Logo} width={100} height={35} />
        <h1 className="magazineBanner__title">
          <Link className="magazineBanner__link plain-link" to="/magazine">
            Magazine
          </Link>
        </h1>
        <h6 className="magazineBanner__subtitle">
          Navigating the world of cannabis in Canada
        </h6>
      </div>
    );
  }
}

export default MagazineBanner;
