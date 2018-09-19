// @flow

import React, { Component } from 'react';
import { matchPath } from 'react-router';

import Search from 'containers/Search';

type Props = {
  match: Object,
};

const data = {
  strains: {
    category: 'Strain',
  },
  accessories: {
    category: 'Product',
  },
  oils: {
    category: 'Oil',
  },
};

class ProductPage extends Component<Props> {
  render() {
    const { url } = this.props.match;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/:slug',
    });
    const { category } = data[slug];
    return <Search category={category} slug={slug} {...this.props} />;
  }
}

export default ProductPage;
