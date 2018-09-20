// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import type { Map } from 'immutable';
import { withRouter } from 'react-router';

import injectSagas from 'utils/injectSagas';

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
  identityUser,
  requestPageMeta,
} from 'containers/App/sagas';

type Props = {
  user: Object,
  lpUser: Object,
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
  pageMeta: Map<*, *>,
  location: Object,
};

class App extends Component<Props> {
  componentDidMount() {
    const {
      user,
      lpUser,
      location: { pathname },
    } = this.props;
    const isLpPath = pathname.startsWith('/lp');
    if (isLpPath) {
      if (lpUser) {
        this.props.requestUser('lp');
      }
    } else if (user) {
      this.props.requestUser(null);
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
        />
        <Routes />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  lpUser: state.getIn(['app', 'lpUser']),
  cart: state.getIn(['app', 'cart']),
  navbarOpen: state.getIn(['app', 'navbarOpen']),
  globalSearchFilter: state.getIn(['app', 'globalSearch', 'filter']),
  globalSearchData: state.getIn(['app', 'globalSearch', 'data']),
  isGlobalSearchLoading: state.getIn(['app', 'globalSearch', 'isLoading']),
  pageMeta: state.getIn(['app', 'pageMeta', 0, 'fields', 'seo', 'fields']),
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
  identityUser: user => dispatch(identityUser(user)),
  requestPageMeta: url => dispatch(requestPageMeta(url)),
});

export default compose(
  withRouter,
  injectSagas({ key: 'app', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);
