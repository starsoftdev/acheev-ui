// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import Load from 'components/Load';

type Props = {
  match: Object,
};

class Routes extends Component<Props> {
  render() {
    const { url } = this.props.match;
    return (
      <Switch>
        <Route
          exact
          path={url}
          render={props => (
            <Load
              loader={() => import('pages/Forum/indexComponent')}
              {...props}
            />
          )}
        />
        <Route
          path={`${url}/create-question`}
          render={props => (
            <Load
              loader={() => import('pages/Forum/CreateQuestion')}
              {...props}
            />
          )}
        />
        <Route
          path={`${url}/:categorySlug/:questionSlug`}
          render={props => (
            <Load loader={() => import('pages/Forum/Question')} {...props} />
          )}
        />
        <Route
          path={`${url}/:slug`}
          render={props => (
            <Load
              loader={() => import('pages/Forum/indexComponent')}
              {...props}
            />
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
