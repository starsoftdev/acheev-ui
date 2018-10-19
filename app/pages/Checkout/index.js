// @flow

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';

import injectSagas from 'utils/injectSagas';

import PageBanner from 'components/PageBanner';
import CheckoutContainer from 'containers/Checkout';

import saga, { reducer } from 'containers/Checkout/sagas';

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

export default compose(injectSagas({ key: 'checkout', saga, reducer }))(
  CheckoutPage
);
