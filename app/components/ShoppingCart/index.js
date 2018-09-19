// @flow
import React, { Component } from 'react';
import cx from 'classnames';

import Button from 'components/Button';
import CartAction from 'components/CartAction';
import CartItem from 'components/CartItem';
import Modal from 'components/Modal';
import { getCart } from 'utils/shopify';

import IconClose from 'images/sprite/close.svg';
import modalHTMLContent from './terms';
import './styles.scss';

type Props = {
  closeCart: Function,
  updateCart: Function,
  trackCheckout: Function,
  trackAddProduct: Function,
  trackRemoveProduct: Function,
  open: Boolean,
};

type State = {
  cart: ?Object,
};

class ShoppingCart extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      cart: null,
    };
    getCart().then(cart => {
      this.setState({ cart });
      this.props.updateCart(cart.lineItemCount);
    });
  }
  componentWillReceiveProps() {
    getCart().then(cart => {
      this.setState({ cart });
    });
  }
  decreaseQuantity = (lineItem: Object) => {
    const { cart } = this.state;
    const quantity = lineItem.quantity - 1;
    if (cart) {
      cart.updateLineItem(lineItem.id, quantity).then(updatedCart => {
        this.props.updateCart(updatedCart.lineItemCount);
        this.props.trackRemoveProduct(lineItem.title);
      });
    }
  };
  increaseQuantity = (lineItem: Object) => {
    const { cart } = this.state;
    const quantity = lineItem.quantity + 1;
    if (cart) {
      cart.updateLineItem(lineItem.id, quantity).then(updatedCart => {
        this.props.updateCart(updatedCart.lineItemCount);
        this.props.trackAddProduct(lineItem.title);
      });
    }
  };
  render() {
    const { open } = this.props;
    const { cart } = this.state;
    return (
      <div className={cx('cart', { 'cart--open': open })}>
        <div className="cart__header">
          <h2 className="cart__title">Your shopping cart</h2>
          <CartAction
            glyph={IconClose}
            size={15}
            onClick={() => this.props.closeCart()}
          />
        </div>
        <div className="cart__form">
          {cart &&
            cart.lineItems.map(lineItem => (
              <CartItem
                key={lineItem.id}
                lineItem={lineItem}
                increaseQuantity={this.increaseQuantity}
                decreaseQuantity={this.decreaseQuantity}
              />
            ))}
        </div>
        <div className="cart__body">
          <div className="cart__info row align-middle mb-md">
            <div className="cart__total column">Total</div>
            <div className="cart__currency shrink column npr">CAD</div>
            <div className="cart__totalPrice shrink column">
              ${cart && cart.subtotal}
            </div>
          </div>
          <div className="row align-center mb-md">
            <div className="shrink column">
              <Button
                className="secondary expanded"
                onClick={() => {
                  this.props.trackCheckout();
                  window.open(cart ? cart.checkoutUrl : '', '_blank');
                }}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
        <div className="cart__footer">
          <Modal
            promptText="Shipping and discount codes are added at checkout."
            linkText="General Terms of Use"
            textIsButton={false}
            content={modalHTMLContent.liftRewardsToS}
            title="Lift Rewards™"
            isOpen={false}
          />
        </div>
      </div>
    );
  }
}

export default ShoppingCart;
