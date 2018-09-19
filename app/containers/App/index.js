// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import type { Map } from 'immutable';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';

import { INTERCOM_APP_ID } from 'enum/constants';
import injectSagas from 'utils/injectSagas';

import Header from 'components/Header';
import LpHeader from 'components/Header/LP';
import RecommendationHeader from 'components/RecommendationHeader';
import Footer from 'components/Footer';
import LpFooter from 'components/Footer/LP';
import ShoppingCart from 'components/ShoppingCart';
import Routes from 'routes';
import PageMeta from 'components/PageMeta';
import RecommendationWizard from 'pages/RecommendationWizard';
import RTOBanner from 'components/Banner/RTO';

import AgeConfirmation from 'components/AgeConfirmation';

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
  closeCart: Function,
  updateCart: Function,
  trackCheckout: Function,
  trackAddProduct: Function,
  trackRemoveProduct: Function,
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
      if (window.Intercom) {
        window.Intercom('boot', {
          app_id: INTERCOM_APP_ID,
          name: user.username,
          email: user.email,
          created_at: user.joindate,
        });
        window.Intercom('update');
      }
      this.props.identityUser(user);
    } else if (window.Intercom) {
      window.Intercom('boot', {
        app_id: INTERCOM_APP_ID,
      });
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
      lpUser,
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
        <Switch>
          <Route
            path="/(recommender|recommendation)"
            component={RecommendationHeader}
          />
          <Route path="/(completeprofile|completeprofile2)" />
          <Route path="/(strains|oils)/:slug/create-review/:step" />
          <Route path="/(strains|oils)/:slug/create-review" />
          <Route
            path="/lp"
            render={() => (
              <LpHeader
                user={lpUser}
                logout={this.props.logout}
                replace={this.props.replace}
                pathname={pathname}
              />
            )}
          />
          <Route
            path="/"
            render={() => (
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
            )}
          />
        </Switch>

        <Switch>
          <Route exact path="/" render={() => <RTOBanner />} />
        </Switch>
        <RecommendationWizard user={user} />

        <Routes />

        <Switch>
          <Route path="/(recommender|recommendation)" />
          <Route path="/(completeprofile|completeprofile2)" />
          <Route path="/(strains|oils)/:slug/create-review/:step" />
          <Route path="/(strains|oils)/:slug/create-review" />
          <Route path="/lp" component={LpFooter} />
          <Route
            path="/"
            render={() => (
              <React.Fragment>
                <Footer />
                <ShoppingCart
                  open={cart.get('open')}
                  itemCount={cart.get('itemCount')}
                  closeCart={this.props.closeCart}
                  updateCart={this.props.updateCart}
                  trackCheckout={this.props.trackCheckout}
                  trackAddProduct={this.props.trackAddProduct}
                  trackRemoveProduct={this.props.trackRemoveProduct}
                />
              </React.Fragment>
            )}
          />
        </Switch>
        <AgeConfirmation user={user} />
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
