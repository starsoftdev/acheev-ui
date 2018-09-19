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
    const isLpPath = pathname.startsWith('/lp');
    const isAuthenticated = storage.get(isLpPath ? 'lpUser' : 'user');
    const redirect = isLpPath ? '/login-lp' : '/login';
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
