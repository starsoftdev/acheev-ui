// @flow

import * as React from 'react';
import Link from 'components/Link';

import './styles.scss';

const Banner = () => (
  <div className="banner mb-lg">
    <div className="banner__inner row">
      <div className="banner__content">
        <div className="small-12 large-6 column">
          <h2 className="banner__title mb-md">
            <strong>
              Are you looking for a cannabis <Link to="/strains">strain</Link>
              &nbsp;or&nbsp;<Link to="/oils">oil</Link>?
            </strong>
          </h2>
        </div>
        <div className="small-10 large-6 column">
          <div className="banner__subTitle">
            Lift & Co. helps Canadians explore, understand and make
            better-informed decisions around cannabis.
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Banner;
