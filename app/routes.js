// @flow

import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import load from 'utils/load';

import { Route, PrivateRoute, ExternalRedirect } from 'components/Routes';

const Magazine = load(() => import('pages/Magazine'));
const Product = load(() => import('pages/Product'));
const LP = load(() => import('pages/LP'));
const Profile = load(() => import('pages/Profile'));
const Business = load(() => import('pages/Business'));
const CompleteProfile = load(() => import('pages/CompleteProfile'));
const CompleteProfile2 = load(() => import('pages/CompleteProfile2'));
const Home = load(() => import('pages/Home'));
const Login = load(() => import('pages/Login'));
const LPlogin = load(() => import('pages/LP/Login'));
const Register = load(() => import('pages/Register'));
const ResetPassword = load(() => import('pages/ResetPassword'));
const ChangePassword = load(() => import('pages/ChangePassword'));
const EmailVerification = load(() => import('pages/EmailVerification'));
const Forum = load(() => import('pages/Forum'));
const FAQ = load(() => import('pages/Faq'));
const Privacy = load(() => import('pages/Privacy'));
const Businesses = load(() => import('pages/Businesses'));
const Rewards = load(() => import('pages/Rewards'));
const MemberProfile = load(() => import('pages/MemberProfile'));
const HowItWorks = load(() => import('pages/HowItWorks'));
const About = load(() => import('pages/About'));
const Reviews = load(() => import('pages/Reviews'));
const CreateReview = load(() => import('pages/CreateReview'));
const ReviewSubmiitSuccess = load(() => import('pages/ReviewSubmitSuccess'));
const TokenConfirmation = load(() => import('pages/TokenConfirmation'));
const Investors = load(() => import('pages/Investors'));
const PatientGuide = load(() => import('pages/PatientGuide'));
const Recommendation = load(() => import('pages/Recommendation'));
const GetPoints = load(() => import('pages/GetPoints'));
const GetGuide = load(() => import('pages/GetGuide'));
const Go = load(() => import('pages/Go'));
const TermsAndConditions = load(() => import('pages/TermsAndConditions'));
const FourTwenty = load(() => import('pages/420'));
const Cannabis101 = load(() => import('pages/Cannabis101'));
const FourOfour = load(() => import('pages/404'));

class Routes extends Component<{}> {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route path="/magazine" render={props => <Magazine {...props} />} />
        <Route path="/login" render={props => <Login {...props} />} />
        <Route path="/login-lp" render={props => <LPlogin {...props} />} />
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
        <Route path="/forum" render={props => <Forum {...props} />} />
        <Route
          path="/(strains|oils|accessories)"
          render={props => <Product {...props} />}
        />
        <Route path="/faq" render={props => <FAQ {...props} />} />
        <Route path="/privacy" render={props => <Privacy {...props} />} />
        <Route path="/businesses" render={props => <Businesses {...props} />} />
        <Route path="/rewards" render={props => <Rewards {...props} />} />
        <Route
          path="/(clinics|producers)"
          render={props => <Business {...props} />}
        />
        <Route
          path="/members/:slug"
          render={props => <MemberProfile {...props} />}
        />
        <Route
          path="/how-it-works"
          render={props => <HowItWorks {...props} />}
        />
        <Route path="/about" render={props => <About {...props} />} />
        <Route path="/reviews" render={props => <Reviews {...props} />} />
        <Route
          path="/create-review"
          render={props => <CreateReview {...props} />}
        />
        <Route
          path="/review-submit-success"
          render={props => <ReviewSubmiitSuccess {...props} />}
        />
        <Route
          path="/confirmation/:token"
          render={props => <TokenConfirmation {...props} />}
        />
        <Route path="/investors" render={props => <Investors {...props} />} />
        <Route
          path="/patient-guide"
          render={props => <PatientGuide {...props} />}
        />
        <Route path="/get-points" render={props => <GetPoints {...props} />} />
        <Route path="/get-guide" render={props => <GetGuide {...props} />} />
        <Route path="/go" render={props => <Go {...props} />} />
        <Route
          path="/terms-and-conditions"
          render={props => <TermsAndConditions {...props} />}
        />
        <Route path="/420" render={props => <FourTwenty {...props} />} />
        <Route
          path="/cannabis-101"
          render={props => <Cannabis101 {...props} />}
        />
        <Route path="/recommender" />
        <Route
          path="/recommendation"
          render={props => <Recommendation {...props} />}
        />
        <PrivateRoute path="/me" render={props => <Profile {...props} />} />
        <PrivateRoute path="/lp" render={props => <LP {...props} />} />
        <PrivateRoute
          path="/completeprofile"
          render={props => <CompleteProfile {...props} />}
        />
        <PrivateRoute
          path="/completeprofile2"
          render={props => <CompleteProfile2 {...props} />}
        />
        <Route
          path="/advice"
          component={({ location }) => (
            <Redirect
              to={{
                ...location,
                pathname: location.pathname.replace(/advice/, 'forum'),
              }}
            />
          )}
        />
        <ExternalRedirect from="/giveaways" to="http://swee.ps/FETrAJLtO" />
        <ExternalRedirect
          from="/retail"
          to="http://unbouncepages.com/liftandcoretail/"
        />
        <Redirect
          from="/(the-coast|wabanaki)"
          to="/strains/organigram-wabanaki/create-review"
        />
        <Redirect from="/(newagora|expoto18)" to="/rewards" />
        <Redirect from="/dispensaries" to="/businesses" />
        <Route render={props => <FourOfour {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
