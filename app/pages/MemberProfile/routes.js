// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import Load from 'components/Load';

type Props = {
  url: string,
  slug: string,
};

export default class Routes extends Component<Props> {
  render() {
    const { url, slug } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={url}
          render={props => (
            <Load loader={() => import('./indexComponent')} {...props} />
          )}
        />
        <Route
          path={`${url}/following`}
          render={props => (
            <Load loader={() => import('./Following')} {...props} />
          )}
        />
        <Route
          path={`${url}/reviews`}
          render={props => (
            <Load loader={() => import('./Reviews')} slug={slug} {...props} />
          )}
        />
      </Switch>
    );
  }
}
