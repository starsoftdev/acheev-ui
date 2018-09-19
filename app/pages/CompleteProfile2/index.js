// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';

import CompleteProfileForm from 'containers/CompleteProfileForm';

class CompleteProfile2Page extends Component<{}> {
  render() {
    return (
      <div>
        <Helmet title="Complete Profile - Lift & Co." />
        <CompleteProfileForm step={2} />
      </div>
    );
  }
}

export default CompleteProfile2Page;
