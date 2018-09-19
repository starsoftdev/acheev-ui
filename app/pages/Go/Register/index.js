// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import PageBanner from 'components/PageBanner';
import RegisterForm from 'containers/RegisterForm';

import { trackGoStep1 } from 'containers/App/sagas';

type Props = {
  trackGoStep1: Function,
};

class RegisterPage extends Component<Props> {
  render() {
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Go',
      },
    ]);
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          responsiveBg
          title="Write a review"
          subtitle="Signing up takes a minute, and you’ll immediately be able to start earning Lift Points towards your personal cannabis rewards."
        />
        <RegisterForm
          redirectTo="/go"
          trackGoStep1={this.props.trackGoStep1}
          isFromGo
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  trackGoStep1: () => dispatch(trackGoStep1()),
});

export default connect(
  null,
  mapDispatchToProps
)(RegisterPage);
