// @flow

import React, { Component } from 'react';

import ProductList from 'containers/BusinessProfile/ProductList';

type Props = {
  slug: string,
};

class BusinessProductListPage extends Component<Props> {
  render() {
    const { slug } = this.props;
    return <ProductList slug={slug} />;
  }
}

export default BusinessProductListPage;
