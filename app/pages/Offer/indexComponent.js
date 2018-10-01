// @flow

import React, { Component } from 'react';

import OfferContainer from 'containers/Offer';

type Props = {
  match: Object,
};

class OfferPage extends Component<Props> {
  render() {
    return <OfferContainer {...this.props} />;
  }
}

export default OfferPage;
