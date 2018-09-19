// @flow

import React, { Component } from 'react';
import { history } from 'components/ConnectedRouter';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import BorderedTitle from 'components/BorderedTitle';
import FeatureList from 'components/FeatureList';
import Preloader from 'components/Preloader';

import { confirmEmail } from 'containers/App/sagas';

type Props = {
  confirmEmail: Function,
  pendingUser: Object,
  location: Object,
  isConfirming: boolean,
  confirmError: string,
};

class EmailVerificationPage extends Component<Props> {
  componentWillMount() {
    const { pendingUser, location: { query: { token } } } = this.props;
    if (!token || !pendingUser) {
      history.push('/login');
      return;
    }
    const email = pendingUser.get('email');

    this.props.confirmEmail(email, token);
  }
  render() {
    const { isConfirming, confirmError } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Confirm Email',
      },
    ]);
    if (isConfirming) return <Preloader />;
    let confirmMessage = `
      You are now registered with Lift.
      You can now earn Lift Points to unlock your Rewards by writing a product or business review.
    `;
    if (confirmError) {
      confirmMessage = confirmError;
    }
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <div className="row mb-lg mt-lg">
          <div className="column small-12 large-8 large-offset-2">
            <BorderedTitle centered>
              <div className="fs-mx text-left">{confirmMessage}</div>
            </BorderedTitle>
          </div>
        </div>
        <FeatureList className="mb-hg" />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  pendingUser: state.getIn(['app', 'pendingUser']),
  isConfirming: state.getIn(['app', 'isConfirming']),
  confirmError: state.getIn(['app', 'confirmError']),
});
const mapDispatchToProps = dispatch => ({
  confirmEmail: (email, token) => dispatch(confirmEmail(email, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  EmailVerificationPage
);
