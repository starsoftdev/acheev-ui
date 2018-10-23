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
  requestRegisterEmail,
  requestLogin,
  requestFBLogin,
  requestGoogleLogin,
  requestForgotPassword,
  openModal,
  closeModal,
} from 'containers/App/sagas';

type Props = {
  user: Object,
  modal: string,
  isLoading: boolean,
  error: string,
  isSocialLoading: boolean,
  socialError: string,
  requestRegisterEmail: Function,
  requestLogin: Function,
  requestFBLogin: Function,
  requestGoogleLogin: Function,
  requestForgotPassword: Function,
  openModal: Function,
  onCloseModal: Function,
  replace: Function,
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
  user: state.getIn(['app', 'user']),
  modal: state.getIn(['app', 'modal']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
  isSocialLoading: state.getIn(['app', 'isSocialLoading']),
  socialError: state.getIn(['app', 'socialError']),
});

const mapDispatchToProps = dispatch => ({
  requestRegisterEmail: email => dispatch(requestRegisterEmail(email)),
  requestLogin: payload => dispatch(requestLogin(payload)),
  requestFBLogin: payload => dispatch(requestFBLogin(payload)),
  requestGoogleLogin: payload => dispatch(requestGoogleLogin(payload)),
  requestForgotPassword: payload => dispatch(requestForgotPassword(payload)),
  openModal: modal => dispatch(openModal(modal)),
  onCloseModal: () => dispatch(closeModal()),
  replace: path => dispatch(replace(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalContainer);
