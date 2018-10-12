// @flow

import React, { Component, Fragment } from 'react';

import PageBanner from 'components/PageBanner';
import CheckoutContainer from 'containers/Checkout';

class CheckoutPage extends Component<{}> {
  render() {
    return (
      <Fragment>
        <PageBanner title="Checkout" expanded />
        <CheckoutContainer />
      </Fragment>
    );
  }
}

export default CheckoutPage;
