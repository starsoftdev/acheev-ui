// @flow

import * as React from 'react';

import BorderedTitle from 'components/BorderedTitle';
import terms from './terms';

const TermsAndConditions = () => (
  <div className="row column mb-lg">
    <BorderedTitle centered>Terms and Conditions</BorderedTitle>
    <div dangerouslySetInnerHTML={{ __html: terms }} />
  </div>
);

export default TermsAndConditions;
