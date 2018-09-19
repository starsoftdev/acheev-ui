// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import Overview from 'pages/Faq/Overview';
import Category from 'pages/Faq/Category';

type Props = {
  url: string,
};

export default class Routes extends Component<Props> {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route exact path={url} render={props => <Overview {...props} />} />
        <Route
          path={`${url}/:slug`}
          render={props => <Category {...props} />}
        />
      </Switch>
    );
  }
}
