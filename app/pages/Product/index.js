// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';
import load from 'utils/load';

const Index = load(() => import('pages/Product/indexComponent'));
const Review = load(() => import('pages/Product/Review'));
const ReviewForm = load(() => import('pages/Product/ReviewForm'));
const Single = load(() => import('pages/Product/Single'));

type Props = {
  match: Object,
};

export default class Routes extends Component<Props> {
  render() {
    const { url } = this.props.match;
    return (
      <Switch>
        <Route exact path={url} render={props => <Index {...props} />} />
        <Route
          path={`${url}/create-review/:slug`}
          render={props => <ReviewForm {...props} />}
        />
        <Route
          path={`${url}/:slug/create-review/:step`}
          render={props => <ReviewForm {...props} formType="new" />}
        />
        <Route
          path={`${url}/:slug/create-review`}
          render={props => <ReviewForm {...props} formType="new" />}
        />
        <Route
          path={`${url}/reviews/:slug/:id`}
          render={props => <Review {...props} />}
        />
        <Route path={`${url}/:slug`} render={props => <Single {...props} />} />
      </Switch>
    );
  }
}
