// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import load from 'utils/load';

import { Route, PrivateRoute } from 'components/Routes';

const Home = load(() => import('pages/Home'));
const CompleteRegsiter = load(() => import('pages/CompleteRegister'));
const ResetPassword = load(() => import('pages/ResetPassword'));
const ChangePassword = load(() => import('pages/ChangePassword'));
const EmailVerification = load(() => import('pages/EmailVerification'));
const TermsAndConditions = load(() => import('pages/TermsAndConditions'));
const PostOffer = load(() => import('pages/PostOffer'));
const FourOfour = load(() => import('pages/404'));

class Routes extends Component<{}> {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route
          exact
          path="/register/:token"
          render={props => <CompleteRegsiter {...props} />}
        />
        <Route
          path="/reset-password"
          render={props => <ResetPassword {...props} />}
        />
        <Route
          path="/change-password"
          render={props => <ChangePassword {...props} />}
        />
        <Route
          path="/email-verification"
          render={props => <EmailVerification {...props} />}
        />
        <Route
          path="/terms-and-conditions"
          render={props => <TermsAndConditions {...props} />}
        />
        <PrivateRoute
          path="/post-offer"
          render={props => <PostOffer {...props} />}
        />
        <Route render={props => <FourOfour {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
