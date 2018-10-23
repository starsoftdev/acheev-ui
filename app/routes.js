// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import load from 'utils/load';

import { Route, PrivateRoute } from 'components/Routes';

const Home = load(() => import('pages/Home'));
const CompleteRegsiter = load(() => import('pages/CompleteRegister'));
const ResetPassword = load(() => import('pages/ResetPassword'));
const PostOffer = load(() => import('pages/PostOffer'));
const Offer = load(() => import('pages/Offer'));
const Profile = load(() => import('pages/Profile'));
const Checkout = load(() => import('pages/Checkout'));
const MemberProfile = load(() => import('pages/MemberProfile'));
const Dashboard = load(() => import('pages/Dashboard'));
const Message = load(() => import('pages/Message'));
const TermsAndConditions = load(() => import('pages/TermsAndConditions'));
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
        <Route path="/offers" render={props => <Offer {...props} />} />
        <Route
          path="/member/:username"
          render={props => <MemberProfile {...props} />}
        />
        <PrivateRoute
          path="/dashboard"
          render={props => <Dashboard {...props} />}
        />
        <PrivateRoute
          path="/post-offer"
          render={props => <PostOffer {...props} />}
        />
        <PrivateRoute
          path="/checkout"
          render={props => <Checkout {...props} />}
        />
        <PrivateRoute path="/me" render={props => <Profile {...props} />} />
        <PrivateRoute
          path="/messages"
          render={props => <Message {...props} />}
        />
        <Route
          path="/reset-password/:token"
          render={props => <ResetPassword {...props} />}
        />
        <Route
          path="/terms-and-conditions"
          render={props => <TermsAndConditions {...props} />}
        />
        <Route render={props => <FourOfour {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
