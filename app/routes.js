// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import load from 'utils/load';

import { Route, PrivateRoute } from 'components/Routes';

const Profile = load(() => import('pages/Profile'));
const CompleteProfile = load(() => import('pages/CompleteProfile'));
const CompleteProfile2 = load(() => import('pages/CompleteProfile2'));
const Home = load(() => import('pages/Home'));
const Login = load(() => import('pages/Login'));
const Register = load(() => import('pages/Register'));
const ResetPassword = load(() => import('pages/ResetPassword'));
const ChangePassword = load(() => import('pages/ChangePassword'));
const EmailVerification = load(() => import('pages/EmailVerification'));
const TermsAndConditions = load(() => import('pages/TermsAndConditions'));
const FourOfour = load(() => import('pages/404'));

class Routes extends Component<{}> {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route path="/login" render={props => <Login {...props} />} />
        <Route path="/register" render={props => <Register {...props} />} />
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
        <PrivateRoute path="/me" render={props => <Profile {...props} />} />
        <PrivateRoute
          path="/completeprofile"
          render={props => <CompleteProfile {...props} />}
        />
        <PrivateRoute
          path="/completeprofile2"
          render={props => <CompleteProfile2 {...props} />}
        />
        <Route render={props => <FourOfour {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
