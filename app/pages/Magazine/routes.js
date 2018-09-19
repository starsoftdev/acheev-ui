// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import Index from './indexComponent';
import Contributors from './Contributors';
import Category from './Category';
import Tag from './Tag';
import Post from './Post';

type Props = {
  url: string,
};

export default class Routes extends Component<Props> {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route exact path={url} render={props => <Index {...props} />} />
        <Route
          path={`${url}/contributors`}
          render={props => <Contributors {...props} />}
        />
        <Route
          path={`${url}/category/:slug`}
          render={props => <Category {...props} url={url} />}
        />
        <Route path={`${url}/tag/:slug`} render={props => <Tag {...props} />} />
        <Route path={`${url}/:slug`} render={props => <Post {...props} />} />
      </Switch>
    );
  }
}
