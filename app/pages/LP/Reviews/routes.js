// @flow

import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route } from 'components/Routes';
import type { Moment } from 'moment';

import load from 'utils/load';

const BusinessReview = load(() => import('pages/LP/Reviews/Business'));
const ProductReview = load(() => import('pages/LP/Reviews/Product'));

type Props = {
  url: string,
  from: Moment,
  to: Moment,
};

export default class Routes extends Component<Props> {
  render() {
    const { url, from, to } = this.props;
    return (
      <Switch>
        <Route
          path={`${url}/business`}
          render={props => <BusinessReview {...props} from={from} to={to} />}
        />
        <Route
          path={`${url}/:category`}
          render={props => <ProductReview {...props} from={from} to={to} />}
        />
        <Redirect from={url} to={`${url}/strains`} />
      </Switch>
    );
  }
}
