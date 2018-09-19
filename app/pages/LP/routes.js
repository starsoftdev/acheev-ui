// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import load from 'utils/load';

const Dashboard = load(() => import('pages/LP/Dashboard'));
const Reviews = load(() => import('pages/LP/Reviews'));
const Demographics = load(() => import('pages/LP/Demographics'));
const Products = load(() => import('pages/LP/Products'));
const Profile = load(() => import('pages/LP/Profile'));
const Register = load(() => import('pages/Register'));
const ResetPassword = load(() => import('pages/LP/ResetPassword'));
const ChangePassword = load(() => import('pages/LP/ChangePassword'));

type Props = {
  url: string,
};

export default class Routes extends Component<Props> {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route exact path={url} render={props => <Dashboard {...props} />} />
        <Route
          path={`${url}/reviews`}
          render={props => <Reviews {...props} />}
        />
        <Route
          path={`${url}/demographics`}
          render={props => <Demographics {...props} />}
        />
        <Route
          path={`${url}/products`}
          render={props => <Products {...props} url={url} />}
        />
        <Route
          path={`${url}/profile`}
          render={props => <Profile {...props} />}
        />
        <Route
          path={`${url}/register`}
          render={props => <Register {...props} />}
        />
        <Route
          path={`${url}/reset-password`}
          render={props => <ResetPassword {...props} />}
        />
        <Route
          path={`${url}/change-password`}
          render={props => <ChangePassword {...props} />}
        />
      </Switch>
    );
  }
}
