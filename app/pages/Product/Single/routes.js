// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import Reviews from 'pages/Product/Single/Reviews';
import Photos from 'pages/Product/Single/Photos';
import About from 'pages/Product/Single/About';

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
          render={props => <About slug={slug} {...props} />}
        />
        <Route
          path={`${url}/reviews`}
          render={props => <Reviews {...props} />}
        />
        <Route path={`${url}/photos`} render={props => <Photos {...props} />} />
      </Switch>
    );
  }
}
