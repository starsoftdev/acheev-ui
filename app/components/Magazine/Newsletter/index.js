// @flow

import * as React from 'react';
import Button from 'components/Button';

import './styles.scss';

const Newsletter = () => (
  <div className="newsletter">
    <h4 className="newsletter__title">
      Get a copy of Cannabis and Active Living mailed to you
    </h4>
    <Button className="secondary bold small expanded">Sign me up</Button>
  </div>
);

export default Newsletter;
