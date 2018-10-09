// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import Edit from './Edit';
import Invite from './Invite';

type Props = {
  url: string,
};

class Routes extends Component<Props> {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route exact path={url} render={props => <Edit {...props} />} />
        <Route path={`${url}/invite`} render={props => <Invite {...props} />} />
      </Switch>
    );
  }
}

export default Routes;
