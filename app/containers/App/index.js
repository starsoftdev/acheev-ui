// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import type { Map } from 'immutable';
import { withRouter } from 'react-router';

import injectSagas from 'utils/injectSagas';

import ModalContainer from 'containers/Modal';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Routes from 'routes';
import PageMeta from 'components/PageMeta';

import saga, {
  reducer,
  logout,
  openCart,
  closeCart,
  updateCart,
  trackCheckout,
  trackAddProduct,
  trackRemoveProduct,
  requestUser,
  openNavbar,
  closeNavbar,
  requestGlobalSearch,
  requestPageMeta,
  openModal,
  closeModal,
  requestRegisterEmail,
} from 'containers/App/sagas';

type Props = {
  user: Object,
  logout: Function,
  openCart: Function,
  replace: Function,
  requestUser: Function,
  cart: Object,
  openNavbar: Function,
  closeNavbar: Function,
  globalSearchFilter: Map<*, *>,
  globalSearchData: Map<string, Object>,
  isGlobalSearchLoading: boolean,
  navbarOpen: boolean,
  requestGlobalSearch: Function,
  identityUser: Function,
  requestPageMeta: Function,
  openModal: Function,
  closeModal: Function,
  requestRegisterEmail: Function,
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
    if (user) {
      this.props.identityUser(user);
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
      user,
      cart,
      globalSearchData,
      globalSearchFilter,
      isGlobalSearchLoading,
      navbarOpen,
      pageMeta,
      modal,
      location: { pathname },
    } = this.props;

    return (
      <div>
        <PageMeta data={pageMeta} />
        <Header
          user={user}
          logout={this.props.logout}
          openCart={this.props.openCart}
          openNavbar={this.props.openNavbar}
          closeNavbar={this.props.closeNavbar}
          replace={this.props.replace}
          itemCount={cart.get('itemCount')}
          pathname={pathname}
          globalSearchData={globalSearchData}
          globalSearchFilter={globalSearchFilter}
          isGlobalSearchLoading={isGlobalSearchLoading}
          navbarOpen={navbarOpen}
          requestGlobalSearch={this.props.requestGlobalSearch}
          openModal={this.props.openModal}
        />
        <Routes />
        <Footer />
        <ModalContainer
          modal={modal}
          openModal={this.props.openModal}
          onCloseModal={this.props.closeModal}
          requestRegisterEmail={this.props.requestRegisterEmail}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  cart: state.getIn(['app', 'cart']),
  navbarOpen: state.getIn(['app', 'navbarOpen']),
  globalSearchFilter: state.getIn(['app', 'globalSearch', 'filter']),
  globalSearchData: state.getIn(['app', 'globalSearch', 'data']),
  isGlobalSearchLoading: state.getIn(['app', 'globalSearch', 'isLoading']),
  pageMeta: state.getIn(['app', 'pageMeta', 0, 'fields', 'seo', 'fields']),
  modal: state.getIn(['app', 'modal']),
});

const mapDispatchToProps = dispatch => ({
  logout: type => dispatch(logout(type)),
  openCart: () => dispatch(openCart()),
  closeCart: () => dispatch(closeCart()),
  updateCart: itemCount => dispatch(updateCart(itemCount)),
  trackCheckout: () => dispatch(trackCheckout()),
  trackAddProduct: product => dispatch(trackAddProduct(product)),
  trackRemoveProduct: product => dispatch(trackRemoveProduct(product)),
  replace: path => dispatch(replace(path)),
  requestUser: type => dispatch(requestUser(type)),
  openNavbar: () => dispatch(openNavbar()),
  closeNavbar: () => dispatch(closeNavbar()),
  requestGlobalSearch: (path, value) =>
    dispatch(requestGlobalSearch(path, value)),
  requestPageMeta: url => dispatch(requestPageMeta(url)),
  openModal: modal => dispatch(openModal(modal)),
  closeModal: () => dispatch(closeModal()),
  requestRegisterEmail: email => dispatch(requestRegisterEmail(email)),
});

export default compose(
  withRouter,
  injectSagas({ key: 'app', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);
