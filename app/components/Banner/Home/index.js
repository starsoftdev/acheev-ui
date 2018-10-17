// @flow

import * as React from 'react';

import './styles.scss';

const HomeBanner = () => (
  <div className="homeBanner">
    <div className="homeBanner__overlay" />
    <div className="homeBanner__inner">
      <h1 className="homeBanner__title">Don&apos;t Just Dream, Do!</h1>
      <div className="homeBanner__subTitle">
        Hire, manage, and pay people with smart contracts.
      </div>
      <div className="homeBanner__btn" role="button">
        <span>Get Started</span>
      </div>
    </div>
  </div>
);

export default HomeBanner;
