// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { List, fromJS } from 'immutable';
import type { Map } from 'immutable';

import Preloader from 'components/Preloader';
import Breadcrumbs from 'components/Breadcrumbs';
import ProductProfile from 'components/ProductProfile';
import CannabisProductProfile from 'components/CannabisProductProfile';
import { getCart, shopClient } from 'utils/shopify';
import { get } from 'utils/immutable';

type Props = {
  requestProduct: Function,
  openCart: Function,
  updateCart: Function,
  setMetaJson: Function,
  data: Map<*, *>,
  isLoading: boolean,
  error: string,
  cart: Object,
  currentUser: Object,
  breadcrumbPath: List<Map<string, Object>>,
  helmetTitle: string,
  productFollowLike: Object,
  followLikeProduct: Function,
  follows: Object,
  requestProductFollows: Function,
  likes: Object,
  requestProductLikes: Function,
  trackPurchaseButton: Function,
  trackAddProduct: Function,
  slug: string,
  params: Object,
};

type State = {
  shopifyProduct: ?Object,
  cart: ?Object,
};

class ProductProfileContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      cart: null,
      shopifyProduct: null,
    };
    getCart().then(cart => this.setState({ cart }));
  }

  componentDidMount() {
    this.requestFollowsAndLikes();
  }

  componentDidUpdate(oldProps: Props) {
    const {
      data,
      slug,
      params,
      cart,
      isLoading,
      error,
      productFollowLike,
    } = this.props;
    const currentProductId = get(data, 'shopifyProductId');
    const nextProductId = get(data, 'shopifyProductId');
    let productMetaJson = {};
    const wasLoadingProduct = oldProps.isLoading;
    const isProductLoaded = isLoading === false && error === '';
    const wasFollowingOrLiking = get(oldProps.productFollowLike, 'isLoading');
    const isFollowedOrLiked =
      get(productFollowLike, 'isLoading') === false &&
      get(productFollowLike, 'error') === '';

    if (
      (wasLoadingProduct && isProductLoaded) ||
      (wasFollowingOrLiking && isFollowedOrLiked)
    ) {
      this.requestFollowsAndLikes();
    }

    if (wasLoadingProduct && isProductLoaded) {
      productMetaJson = {
        '@type': 'Product',
        category: data.get('category'),
        productID: data.get('slug'),
        description: data.get('description'),
        name: data.get('name'),
        brand: {
          '@type': 'Organization',
          name: data.getIn(['business', 'name']),
          email: data.getIn(['business', 'email']),
          faxNumber: data.getIn(['business', 'fax']),
          logo: data.getIn(['business', 'thumbnail']),
          description: data.getIn(['business', 'description']),
          telephone: data.getIn(['business', 'telephone']),
          url: data.getIn(['business', 'website']),
          address: {
            '@type': 'PostalAddress',
            addressLocality: data.getIn(['business', 'locations', 0, 'city']),
            addressRegion: data.getIn(['business', 'locations', 0, 'province']),
            postalCode: data.getIn(['business', 'locations', 0, 'postalCode']),
            streetAddress: data.getIn(['business', 'locations', 0, 'address']),
          },
        },
      };
      if (get(data, 'reviews', fromJS({})) > 0) {
        (productMetaJson: Object).aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: data.get('rating'),
          bestRating: 5,
          worstRating: 0,
          reviewCount: data.get('reviews').size,
        };
      }
      this.props.setMetaJson(['mainEntity'], productMetaJson);
    }

    if (params.slug !== slug) {
      this.props.requestProduct(params.slug);
    }

    if (currentProductId !== nextProductId && nextProductId) {
      shopClient
        .fetchProduct(get(data, 'shopifyProductId'))
        .then(shopifyProduct => {
          this.setState({
            shopifyProduct,
          });
        });
    }
    if (get(cart, 'itemCount') !== get(oldProps.cart, 'itemCount')) {
      getCart().then(updatedCart => this.setState({ cart: updatedCart }));
    }
  }

  requestFollowsAndLikes() {
    const { data } = this.props;
    this.props.requestProductFollows(get(data, '_id'));
    this.props.requestProductLikes(get(data, '_id'));
  }

  addToCart = (product: Object, qty: number) => {
    const { cart } = this.state;
    const cartLineItem = cart
      ? cart.lineItems.filter(
          item => item.variant_id === product.selectedVariant.id
        )[0]
      : null;

    if (cartLineItem && cart) {
      cart
        .updateLineItem(
          cartLineItem.id,
          parseInt(cartLineItem.quantity, 10) + parseInt(qty, 10)
        )
        .then(updatedCart => this.props.updateCart(updatedCart.lineItemCount));
    } else if (cart) {
      cart
        .createLineItemsFromVariants({
          variant: product.selectedVariant,
          quantity: qty,
        })
        .then(updatedCart => this.props.updateCart(updatedCart.lineItemCount));
    }
    this.props.openCart();
    this.props.trackAddProduct(product.title);
  };
  render() {
    const {
      data,
      isLoading,
      error,
      currentUser,
      breadcrumbPath,
      helmetTitle,
      productFollowLike,
      follows,
      likes,
    } = this.props;
    const { shopifyProduct } = this.state;
    if (isLoading) return <Preloader height={200} />;
    return data && error === '' ? (
      <div>
        <Helmet title={helmetTitle} />
        <Breadcrumbs path={breadcrumbPath} />
        {get(data, '__t') ? (
          <CannabisProductProfile
            data={data}
            addToCart={this.addToCart}
            shopifyProduct={shopifyProduct}
            currentUser={currentUser}
            follows={follows}
            likes={likes}
            productFollowLike={productFollowLike}
            followLikeProduct={this.props.followLikeProduct}
            trackPurchaseButton={this.props.trackPurchaseButton}
          />
        ) : (
          <ProductProfile
            data={data}
            addToCart={this.addToCart}
            shopifyProduct={shopifyProduct}
            currentUser={currentUser}
            follows={follows}
            likes={likes}
            productFollowLike={productFollowLike}
            followLikeProduct={this.props.followLikeProduct}
            trackPurchaseButton={this.props.trackPurchaseButton}
          />
        )}
      </div>
    ) : null;
  }
}

export default ProductProfileContainer;
