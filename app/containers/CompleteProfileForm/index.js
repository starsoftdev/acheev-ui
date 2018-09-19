// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import CompleteProfileForm from 'components/CompleteProfileForm';

import { requestUserDataUpdate } from 'containers/App/sagas';

type Props = {
  isLoading: boolean,
  user: Object,
  error: string,
  saveUserData: Function,
  replace: Function,
  step?: number,
};

class CompleteProfileFormContainer extends Component<Props> {
  render() {
    const { user, isLoading, error, saveUserData, step } = this.props;
    return (
      <CompleteProfileForm
        user={user}
        isLoading={isLoading}
        error={error}
        saveUserData={saveUserData}
        replace={this.props.replace}
        step={step}
      />
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  saveUserData: payload => dispatch(requestUserDataUpdate(payload)),
  replace: path => dispatch(replace(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompleteProfileFormContainer);
