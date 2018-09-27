// @flow

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'components/Routes';
import storage from 'store';
import { get } from 'lodash-es';

type Props = {
  render: Function,
  location?: Object,
};

class PrivateRoute extends Component<Props> {
  render() {
    const { render, ...rest } = this.props;
    const pathname = get(rest, ['location', 'pathname']);
    const isAuthenticated = storage.get('user');
    const redirect = '/';
    return (
      <Route
        render={props =>
          isAuthenticated ? (
            render(props)
          ) : (
            <Redirect
              to={{
                pathname: redirect,
                search: `?redirect=${pathname}`,
              }}
            />
          )
        }
        {...rest}
      />
    );
  }
}

export default PrivateRoute;
