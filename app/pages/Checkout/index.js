// @flow

import React, { Component, Fragment } from 'react';

import PageBanner from 'components/PageBanner';

class CheckoutPage extends Component<{}> {
  render() {
    return (
      <Fragment>
        <PageBanner title="Checkout" expanded />
      </Fragment>
    );
  }
}

export default CheckoutPage;
