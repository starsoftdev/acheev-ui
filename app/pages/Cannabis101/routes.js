// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';

import { Route } from 'components/Routes';

import load from 'utils/load';

type Props = {
  url: string,
  currentChapterIndex: number,
};

const Index = load(() => import('./indexComponent'));
const Page = load(() => import('./Page'));

export default class Routes extends Component<Props> {
  render() {
    const { url, currentChapterIndex } = this.props;
    return (
      <Switch>
        <Route exact path={url} render={props => <Index {...props} />} />
        <Route
          path={`${url}/:chapter/:article`}
          render={props => (
            <Page currentChapterIndex={currentChapterIndex} {...props} />
          )}
        />
        <Route
          path={`${url}/:chapter`}
          render={props => (
            <Page currentChapterIndex={currentChapterIndex} {...props} />
          )}
        />
      </Switch>
    );
  }
}
