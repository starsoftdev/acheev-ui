// @flow

import * as React from 'react';

import './styles.scss';

const RTOBanner = () => (
  <div className="rtoBanner">
    <div className="row align-middle align-center">
      <div className="column small-12 medium-shrink">
        <h1 className="rtoBanner__bigText">We have LIFT off!</h1>
      </div>
      <div className="column small-12 large-3">
        <h3 className="rtoBanner__smallText">
          Lift &amp; Co. is now trading on the TSX-V, under the symbol
          &quot;LIFT&quot;
        </h3>
      </div>
      <div className="column small-12 medium-shrink">
        <a
          className="button coral"
          href="http://investors.lift.co"
          target="_blank"
        >
          Learn more
        </a>
      </div>
    </div>
  </div>
);

export default RTOBanner;
