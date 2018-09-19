// @flow

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectSagas from 'utils/injectSagas';
import ChangePassword from 'containers/ChangePassword';

import saga, { reducer, requestChange } from 'containers/ChangePassword/sagas';

type Props = {
  requestChange: Function,
  location: Object,
  isLoading: boolean,
  success: string,
  error: string,
};

const LpChangePasswordPage = (props: Props) => {
  const { location, isLoading, success, error } = props;
  return (
    <ChangePassword
      requestChange={props.requestChange}
      isLoading={isLoading}
      success={success}
      error={error}
      location={location}
    />
  );
};

const mapStateToProps = state => ({
  isLoading: state.getIn(['lpChangePassword', 'isLoading']),
  error: state.getIn(['lpChangePassword', 'error']),
  success: state.getIn(['lpChangePassword', 'success']),
});

const mapDispatchToProps = dispatch => ({
  requestChange: (payload, token) => dispatch(requestChange(payload, token)),
});

export default compose(
  injectSagas({ key: 'lpChangePassword', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(LpChangePasswordPage);
