// @flow

import * as React from 'react';
import Link from 'components/Link';

import Button from 'components/Button';
import './styles.scss';
import BannerImage from './banner-image1.png';

const BottomBanner = () => (
  <div className="bottomBanner">
    <div className="bottomBanner__inner row">
      <div className="small-12 small-order-2 large-order-1 large-5 column align-self-middle">
        <h1 className="bottomBanner__title">
          <strong>Like free stuff?</strong>
        </h1>
        <div className="bottomBanner__subTitle mb-lg">
          Join our Cannabis Loyalty Program.
        </div>
        <div className="mb-xl">
          <Button className="coral" element={Link} to="/rewards">
            Join now
          </Button>
        </div>
      </div>
      <div className="bottomBanner__image small-12 small-order-1 large-order-2 large-7">
        <img alt="banner" src={BannerImage} />
      </div>
    </div>
  </div>
);

export default BottomBanner;
