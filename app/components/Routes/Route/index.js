// @flow

import React, { Component } from 'react';
import parseSearch from 'utils/parseSearch';
import { Route } from 'react-router-dom';

type Props = {
  location?: Object,
};

class CustomRoute extends Component<Props> {
  render() {
    const { location, ...otherProps } = this.props;
    const query = location && parseSearch(location.search);
    const locationWithQuery = {
      ...location,
      query,
    };
    return <Route key={0} location={locationWithQuery} {...otherProps} />;
  }
}

export default CustomRoute;
