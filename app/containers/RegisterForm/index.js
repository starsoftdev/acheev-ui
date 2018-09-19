// @flow

import React from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import RegisterForm from 'components/RegisterForm';

import { requestRegister } from 'containers/App/sagas';

type Props = {
  isLoading: boolean,
  user: Object,
  error: string,
  requestRegister: Function,
  replace: Function,
};

const RegisterFormContainer = (props: Props) => <RegisterForm {...props} />;

const mapStateToProps = state => ({
  isLoading: state.getIn(['app', 'isLoading']),
  user: state.getIn(['app', 'user']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestRegister: (payload, type) => dispatch(requestRegister(payload, type)),
  replace: path => dispatch(replace(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterFormContainer);
