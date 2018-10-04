// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';
import load from 'utils/load';

const Index = load(() => import('pages/Offer/indexComponent'));
const Single = load(() => import('pages/Offer/Single'));
type Props = {
  match: Object,
};

export default class Routes extends Component<Props> {
  render() {
    const { url } = this.props.match;
    return (
      <Switch>
        <Route exact path={url} component={Index} />
        <Route exact path={`${url}/:id`} component={Single} />
      </Switch>
    );
  }
}
