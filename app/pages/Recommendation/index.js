// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { Switch } from 'react-router-dom';

import { Route } from 'components/Routes';
import saga, { reducer } from 'containers/Recommendation/sagas';
import injectSagas from 'utils/injectSagas';
import load from 'utils/load';

import './styles.scss';

const Index = load(() => import('pages/Recommendation/indexComponent'));
const ProductsList = load(() => import('pages/Recommendation/ProductsList'));

type Props = {
  match: { url: string },
  location: { query: string },
};

class Recommendation extends Component<Props> {
  render() {
    const {
      match: { url },
      location: { query },
    } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={url}
          render={props => <Index {...props} query={query} />}
        />
        <Route
          path={`${url}/:category`}
          render={props => <ProductsList {...props} query={query} />}
        />
      </Switch>
    );
  }
}

export default compose(injectSagas({ key: 'recommend', saga, reducer }))(
  Recommendation
);
