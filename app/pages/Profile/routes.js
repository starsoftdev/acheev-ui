// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import Edit from './Edit';
import Reviews from './Reviews';
import Followings from './Followings';

type Props = {
  url: string,
};

class Routes extends Component<Props> {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route exact path={url} render={props => <Edit {...props} />} />
        <Route
          path={`${url}/reviews`}
          render={props => <Reviews {...props} />}
        />
        <Route
          path={`${url}/followings`}
          render={props => <Followings {...props} />}
        />
      </Switch>
    );
  }
}

export default Routes;
