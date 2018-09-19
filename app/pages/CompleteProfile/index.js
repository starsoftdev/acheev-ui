// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';

import CompleteProfileForm from 'containers/CompleteProfileForm';

class CompleteProfilePage extends Component<{}> {
  render() {
    return (
      <div>
        <Helmet title="Complete Profile - Lift & Co." />
        <CompleteProfileForm />
      </div>
    );
  }
}

export default CompleteProfilePage;
