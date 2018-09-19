// @flow

import React, { Component } from 'react';

import ReviewList from 'containers/BusinessProfile/ReviewList';

type Props = {
  params: Object,
  location: Object,
};

class ProducerReviewListPage extends Component<Props> {
  render() {
    const { params, location } = this.props;
    return (
      <ReviewList
        category="producer"
        type="business"
        slug={params.slug}
        location={location}
      />
    );
  }
}

export default ProducerReviewListPage;
