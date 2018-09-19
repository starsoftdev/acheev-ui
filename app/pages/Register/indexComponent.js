// @flow

import React, { Component } from 'react';

import PageBanner from 'components/PageBanner';
import RegisterForm from 'containers/RegisterForm';

import './styles.scss';

class RegisterPage extends Component<{}> {
  render() {
    return (
      <div className="register">
        <PageBanner
          title="Registration"
          titleLarge
          subtitle="Join Canada’s largest online cannabis community"
        />
        <RegisterForm redirectTo="/me" />
      </div>
    );
  }
}

export default RegisterPage;
