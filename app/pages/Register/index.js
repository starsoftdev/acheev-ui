// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import Load from 'components/Load';

type Props = {
  match: Object,
};

export default class Routes extends Component<Props> {
  render() {
    const { url } = this.props.match;
    return (
      <Switch>
        <Route
          exact
          path={url}
          render={props => (
            <Load
              loader={() => import('pages/Register/indexComponent')}
              {...props}
            />
          )}
        />
        <Route
          path={`${url}/success`}
          render={props => (
            <Load loader={() => import('pages/Register/Success')} {...props} />
          )}
        />
      </Switch>
    );
  }
}
