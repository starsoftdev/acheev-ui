// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { matchPath } from 'react-router';
import load from 'utils/load';

import { Route } from 'components/Routes';

const Index = load(() => import('./indexComponent'));
const About = load(() => import('./About'));
const ReviewForm = load(() => import('./ReviewForm'));

type Props = {
  match: Object,
};

export default class Routes extends Component<Props> {
  render() {
    const { url } = this.props.match;
    const {
      params: { category },
    } = matchPath(url, {
      path: '/:category',
    });
    return (
      <Switch>
        <Route exact path={url} render={props => <Index {...props} />} />
        <Route
          path={`${url}/:slug/create-review`}
          render={props => <ReviewForm category={category} {...props} />}
        />
        <Route
          path={`${url}/:slug`}
          render={props => <About category={category} {...props} />}
        />
      </Switch>
    );
  }
}
