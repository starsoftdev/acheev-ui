// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import type { Map } from 'immutable';
import { withRouter } from 'react-router';

import injectSagas from 'utils/injectSagas';

import ModalContainer from 'containers/Modal';
import Header from 'containers/Header';
import Footer from 'components/Footer';
import Routes from 'routes';
import PageMeta from 'components/PageMeta';

import saga, {
  reducer,
  requestUser,
  requestPageMeta,
  openModal,
  closeModal,
  requestRegisterEmail,
  requestLogin,
  requestForgotPassword,
} from 'containers/App/sagas';

type Props = {
  user: Object,
  requestPageMeta: Function,
  openModal: Function,
  closeModal: Function,
  requestUser: Function,
  requestRegisterEmail: Function,
  requestLogin: Function,
  requestForgotPassword: Function,
  modal: string,
  pageMeta: Map<*, *>,
  location: Object,
};

class App extends Component<Props> {
  componentDidMount() {
    const {
      user,
      location: { pathname },
    } = this.props;
    if (user) {
      this.props.requestUser();
    }
    this.props.requestPageMeta(pathname);
  }
  componentDidUpdate(prevProps) {
    const {
      location: { pathname },
    } = prevProps;
    const {
      location: { pathname: newPathname },
    } = this.props;
    if (newPathname !== pathname) {
      this.props.requestPageMeta(newPathname);
    }
  }
  render() {
    const {
      pageMeta,
      modal,
      location: { pathname },
    } = this.props;

    return (
      <div>
        <PageMeta data={pageMeta} />
        <Header pathname={pathname} />
        <Routes />
        <Footer />
        <ModalContainer
          modal={modal}
          openModal={this.props.openModal}
          onCloseModal={this.props.closeModal}
          requestRegisterEmail={this.props.requestRegisterEmail}
          requestLogin={this.props.requestLogin}
          requestForgotPassword={this.props.requestForgotPassword}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  pageMeta: state.getIn(['app', 'pageMeta', 0, 'fields', 'seo', 'fields']),
  modal: state.getIn(['app', 'modal']),
});

const mapDispatchToProps = dispatch => ({
  replace: path => dispatch(replace(path)),
  requestUser: type => dispatch(requestUser(type)),
  requestPageMeta: url => dispatch(requestPageMeta(url)),
  openModal: modal => dispatch(openModal(modal)),
  closeModal: () => dispatch(closeModal()),
  requestRegisterEmail: email => dispatch(requestRegisterEmail(email)),
  requestLogin: payload => dispatch(requestLogin(payload)),
  requestForgotPassword: payload => dispatch(requestForgotPassword(payload)),
});

export default compose(
  withRouter,
  injectSagas({ key: 'app', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);
