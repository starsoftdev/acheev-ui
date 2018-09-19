// @flow

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectSagas from 'utils/injectSagas';

import ResetPassword from 'containers/ResetPassword';

import saga, { reducer, requestReset } from 'containers/ResetPassword/sagas';

type Props = {
  requestReset: Function,
  isLoading: boolean,
  success: string,
  error: string,
};

const LpResetPasswordPage = (props: Props) => {
  const { isLoading, success, error } = props;
  return (
    <ResetPassword
      requestReset={props.requestReset}
      isLoading={isLoading}
      success={success}
      error={error}
    />
  );
};

const mapStateToProps = state => ({
  isLoading: state.getIn(['lpResetPassword', 'isLoading']),
  error: state.getIn(['lpResetPassword', 'error']),
  success: state.getIn(['lpResetPassword', 'success']),
});

const mapDispatchToProps = dispatch => ({
  requestReset: payload => dispatch(requestReset(payload)),
});

export default compose(
  injectSagas({ key: 'lpResetPassword', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(LpResetPasswordPage);
