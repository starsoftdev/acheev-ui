// @flow

import * as React from 'react';

import './styles.scss';

type Props = {
  lineItem: Object,
  decreaseQuantity: Function,
  increaseQuantity: Function,
};

const CartItem = ({ lineItem, increaseQuantity, decreaseQuantity }: Props) => {
  if (!lineItem) return null;
  return (
    <div className="cartItem row mb-xl">
      <div className="small-3 column npl">
        <img
          className="cartItem__img"
          src={lineItem.image.src}
          alt={lineItem.title}
        />
      </div>
      <div className="small-9 column">
        <div className="cartItem__title mb-mn">{lineItem.title}</div>
        {lineItem.variant_title !== 'Default Title' && (
          <div className="cartItem__varitantTitle mb-mn">
            {lineItem.variant_title}
          </div>
        )}
        <div className="row align-middle mb-md fs-tn">
          <div className="cartItem__quantityLabel shrink column">QTY</div>
          <button
            className="cartItem__quantityChange shrink column"
            onClick={() => decreaseQuantity(lineItem)}
          >
            <span>-</span>
          </button>
          <div className="cartItem__quantityValue shrink column">
            {lineItem.quantity}
          </div>
          <button
            className="cartItem__quantityChange shrink column"
            onClick={() => increaseQuantity(lineItem)}
          >
            <span>+</span>
          </button>
        </div>
        <div className="cartItem__price">${lineItem.line_price}</div>
      </div>
    </div>
  );
};

export default CartItem;
