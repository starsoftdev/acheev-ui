// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import RegisterFormModal from 'components/RegisterFormModal';
import MODAL from 'enum/modals';

import { requestRegister } from 'containers/App/sagas';

type Props = {
  isLoading: boolean,
  user: Object,
  error: string,
  requestRegister: Function,
  replace: Function,
  onCloseModal: Function,
  modal: string,
};

class ModalContainer extends Component<Props, {}> {
  render() {
    const { modal } = this.props;
    const isOpen = modal !== null;
    if (modal === MODAL.REGISTER_MODAL) {
      return <RegisterFormModal isOpen={isOpen} {...this.props} />;
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
  replace: path => dispatch(replace(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalContainer);
