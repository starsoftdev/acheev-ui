// @flow

import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { List } from 'immutable';
import type { Map } from 'immutable';
import title from 'utils/title';
import { get } from 'utils/immutable';

import Preloader from 'components/Preloader';
import Link from 'components/Link';
import ProductProfileContainer from 'containers/ProductProfile';
import Helmet from 'components/Helmet';

import injectSagas from 'utils/injectSagas';

import saga, {
  reducer,
  requestProduct,
  followLikeProduct,
  requestProductFollows,
  requestProductLikes,
  trackPurchaseButton,
} from 'containers/Product/sagas';
import {
  openCart,
  updateCart,
  trackAddProduct,
  setMetaJson,
} from 'containers/App/sagas';

import Routes from './routes';

type Props = {
  match: Object,
  requestProduct: Function,
  openCart: Function,
  updateCart: Function,
  followLikeProduct: Function,
  requestProductFollows: Function,
  requestProductLikes: Function,
  trackPurchaseButton: Function,
  setMetaJson: Function,
  trackAddProduct: Function,
  data: Map<*, *>,
  isLoading: boolean,
  error: string,
  slug: string,
  cart: Object,
  currentUser: Object,
  breadcrumbPath: List<Map<string, Object>>,
  helmetTitle: string,
  productFollowLike: Object,
  follows: Object,
  likes: Object,
  location: Object,
};

class ProductPage extends Component<Props> {
  componentDidMount() {
    this.props.requestProduct(this.props.match.params.slug);
  }

  render() {
    const {
      data,
      currentUser,
      isLoading,
      error,
      match: { url, params },
      cart,
      slug,
      breadcrumbPath,
      helmetTitle,
      productFollowLike,
      follows,
      likes,
      location: { pathname },
    } = this.props;
    const {
      params: { productType },
    } = matchPath(pathname, {
      path: '/:productType/:slug',
    });

    return isLoading ? (
      <Preloader />
    ) : (
      <div>
        {data ? (
          <div>
            <Helmet
              meta={[
                {
                  name: 'description',
                  content: `Read reviews on the ${title({
                    name: get(data, 'name'),
                    type: get(data, '__t'),
                  })} submitted by Lift & Co.'s Rewards members. Also see photos and details on the best consumption methods, common effects and more.`,
                },
              ]}
            />
            <ProductProfileContainer
              data={data}
              requestProduct={this.props.requestProduct}
              setMetaJson={this.props.setMetaJson}
              currentUser={currentUser}
              params={params}
              slug={slug}
              isLoading={isLoading}
              error={error}
              cart={cart}
              openCart={this.props.openCart}
              updateCart={this.props.updateCart}
              breadcrumbPath={breadcrumbPath}
              helmetTitle={helmetTitle}
              productFollowLike={productFollowLike}
              followLikeProduct={this.props.followLikeProduct}
              follows={follows}
              requestProductFollows={this.props.requestProductFollows}
              likes={likes}
              requestProductLikes={this.props.requestProductLikes}
              trackPurchaseButton={this.props.trackPurchaseButton}
              trackAddProduct={this.props.trackAddProduct}
            />
            <Routes url={url} slug={params.slug} id={params.id} />
          </div>
        ) : (
          <div className="row column text-center">
            <h3 className="pt-xl pb-xl">
              This product does not exist. Please explore our {productType}{' '}
              <Link className="plain-link" to={`/${productType}`}>
                here
              </Link>.
            </h3>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  data: state.getIn(['product', 'data', 'hits', 0]),
  breadcrumbPath: state.getIn(['product', 'breadcrumbPath']),
  helmetTitle: state.getIn(['product', 'helmetTitle']),
  isLoading: state.getIn(['product', 'isLoading']),
  error: state.getIn(['product', 'error']),
  slug: state.getIn(['product', 'slug']),
  cart: state.getIn(['app', 'cart']),
  productFollowLike: state.getIn(['product', 'productFollowLike']),
  follows: state.getIn(['product', 'follows']),
  likes: state.getIn(['product', 'likes']),
});

const mapDispatchToProps = dispatch => ({
  requestProduct: slug => dispatch(requestProduct(slug)),
  followLikeProduct: (productId, actionType) =>
    dispatch(followLikeProduct(productId, actionType)),
  requestProductFollows: productId =>
    dispatch(requestProductFollows(productId)),
  requestProductLikes: productId => dispatch(requestProductLikes(productId)),
  trackPurchaseButton: (business, product) =>
    dispatch(trackPurchaseButton(business, product)),
  openCart: () => dispatch(openCart()),
  trackAddProduct: product => dispatch(trackAddProduct(product)),
  updateCart: itemCount => dispatch(updateCart(itemCount)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default compose(
  injectSagas({ key: 'product', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProductPage);
