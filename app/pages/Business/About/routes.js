// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';
import load from 'utils/load';

const Index = load(() => import('./indexComponent'));
const Reviews = load(() => import('./ReviewList'));
const Products = load(() => import('./ProductList'));
const ProductReviews = load(() => import('./ProductReviewList'));

type Props = {
  match: Object,
  category: string,
};

export default class Routes extends Component<Props> {
  render() {
    const {
      match: {
        url,
        params: { slug },
      },
      category,
    } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={url}
          render={props => <Index category={category} slug={slug} {...props} />}
        />
        <Route
          path={`${url}/reviews`}
          render={props => (
            <Reviews category={category} slug={slug} {...props} />
          )}
        />
        <Route
          path={`${url}/products`}
          render={props => <Products slug={slug} {...props} />}
        />
        <Route
          path={`${url}/product-reviews`}
          render={props => (
            <ProductReviews slug={slug} category={category} {...props} />
          )}
        />
      </Switch>
    );
  }
}
