// @flow

import React, { Component } from 'react';

import Icon from 'components/Icon';
import CartIcon from 'images/sprite/cart.svg';
import './styles.scss';

type Props = {
  openCart: Function,
  itemCount: number,
};

class CartMenu extends Component<Props> {
  render() {
    const { itemCount } = this.props;
    return (
      <div
        className="cartMenu row align-middle align-right"
        onClick={() => this.props.openCart()}
        role="button"
      >
        <div className="shrink column">
          <Icon className="cartMenu__icon" glyph={CartIcon} size={13} />
        </div>
        {itemCount !== 0 && (
          <div className="shrink column npl">
            <div className="cartMenu__count">{itemCount}</div>
          </div>
        )}
      </div>
    );
  }
}

export default CartMenu;
