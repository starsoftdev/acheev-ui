// @flow

import * as React from 'react';

import BaseModal from 'components/BaseModal';
import RegisterForm from 'components/RegisterForm';

import './styles.scss';

type Props = {
  isLoading: boolean,
  user: Object,
  error: string,
  requestRegister: Function,
  replace: Function,
  isOpen: boolean,
  onCloseModal: Function,
};

const RegisterFormModal = (props: Props) => (
  <BaseModal
    className="registerFormModal"
    isOpen={props.isOpen}
    onCloseModal={props.onCloseModal}
  >
    <RegisterForm {...props} />
  </BaseModal>
);

export default RegisterFormModal;
