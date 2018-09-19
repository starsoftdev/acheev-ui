// @flow

import React, { Component } from 'react';
import { Route } from 'components/Routes';
import { Switch } from 'react-router-dom';

type Props = {
  from: string,
  to: string,
};

class ExternalRedirect extends Component<Props> {
  render() {
    const { from, to } = this.props;
    return (
      <Switch>
        <Route
          path={from}
          component={() => {
            window.location = to;
            return (
              <div className="row column text-center mb-xl">
                <h2>Redirecting...</h2>
              </div>
            );
          }}
        />
      </Switch>
    );
  }
}

export default ExternalRedirect;
