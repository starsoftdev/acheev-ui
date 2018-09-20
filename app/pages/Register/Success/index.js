// @flow

import React, { Component } from 'react';
import { history } from 'components/ConnectedRouter';

import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import Link from 'components/Link';
import BorderedTitle from 'components/BorderedTitle';

import { resendToken } from 'containers/App/sagas';

type Props = {
  resendToken: Function,
  pendingUser: Object,
};

class RegisterSuccessPage extends Component<Props> {
  componentWillMount() {
    const { pendingUser } = this.props;
    if (!pendingUser) {
      history.push('/login');
    }
  }
  reSendLink = () => {
    const { pendingUser } = this.props;
    const email = pendingUser.get('email');
    this.props.resendToken(email);
  };
  render() {
    const breadcrumbPath = fromJS([
      {
        link: '/register',
        title: 'Register',
      },
      {
        link: '',
        title: 'Success/',
      },
    ]);
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <div className="row mb-lg mt-lg">
          <div className="column small-12 large-8 large-offset-2">
            <BorderedTitle centered>
              <div className="fs-mx text-left">
                Thank you for signing up with Lift! You must verify your email
                before you can redeem rewards or write reviews. Please confirm
                your registration by clicking on the email by Lift and following
                the instructions. If you did not receive an email, you can have
                it re-sent by clicking&nbsp;
                <Link className="fs-mx t-nt" onClick={this.reSendLink}>
                  here
                </Link>
              </div>
            </BorderedTitle>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  pendingUser: state.getIn(['app', 'pendingUser']),
});
const mapDispatchToProps = dispatch => ({
  resendToken: email => dispatch(resendToken(email)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterSuccessPage);
