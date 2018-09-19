// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import load from 'utils/load';

const Index = load(() => import('pages/LP/Products/indexComponent'));
const StrainForm = load(() => import('pages/LP/Products/Strain/Form'));
const OilForm = load(() => import('pages/LP/Products/Oil/Form'));

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
          path={`${url}/strains/new`}
          render={props => <StrainForm {...props} />}
        />
        <Route
          path={`${url}/strains/:slug/edit`}
          render={props => <StrainForm {...props} />}
        />
        <Route
          path={`${url}/oils/new`}
          render={props => <OilForm {...props} />}
        />
        <Route
          path={`${url}/oils/:slug/edit`}
          render={props => <OilForm {...props} />}
        />
      </Switch>
    );
  }
}
