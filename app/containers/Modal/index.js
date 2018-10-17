// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import FormModal from 'components/FormModal';
import RegisterForm from 'components/RegisterForm';
import LoginForm from 'components/LoginForm';
import ForgotPasswordForm from 'components/ForgotPasswordForm';

import MODAL from 'enum/modals';

import {
  requestRegister,
  requestFBLogin,
  requestGoogleLogin,
} from 'containers/App/sagas';

type Props = {
  isLoading: boolean,
  user: Object,
  error: string,
  requestRegister: Function,
  replace: Function,
  openModal: Function,
  onCloseModal: Function,
  modal: string,
  requestRegisterEmail: Function,
  requestLogin: Function,
  requestFBLogin: Function,
  requestGoogleLogin: Function,
  requestForgotPassword: Function,
};

class ModalContainer extends Component<Props, {}> {
  render() {
    const { modal } = this.props;
    const isOpen = modal !== null;
    if (modal === MODAL.REGISTER_MODAL) {
      return (
        <FormModal isOpen={isOpen} onCloseModal={this.props.onCloseModal}>
          <RegisterForm {...this.props} />
        </FormModal>
      );
    } else if (modal === MODAL.LOGIN_MODAL) {
      return (
        <FormModal isOpen={isOpen} onCloseModal={this.props.onCloseModal}>
          <LoginForm {...this.props} />
        </FormModal>
      );
    } else if (modal === MODAL.FORGOT_PASSWORD_MODAL) {
      return (
        <FormModal isOpen={isOpen} onCloseModal={this.props.onCloseModal}>
          <ForgotPasswordForm {...this.props} />
        </FormModal>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['app', 'isLoading']),
  user: state.getIn(['app', 'user']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestRegister: (payload, type) => dispatch(requestRegister(payload, type)),
  requestFBLogin: payload => dispatch(requestFBLogin(payload)),
  requestGoogleLogin: payload => dispatch(requestGoogleLogin(payload)),
  replace: path => dispatch(replace(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalContainer);
