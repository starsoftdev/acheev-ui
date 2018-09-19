// @flow

import * as React from 'react';

import Icon from 'components/Icon';

import './styles.scss';

type Props = {
  glyph: string,
  size: number,
  onClick?: Function,
};

const CartAction = ({ glyph, size, onClick }: Props) => (
  <div className="cartAction" onClick={onClick} role="button">
    <Icon className="cartAction__icon" glyph={glyph} size={size} />
  </div>
);

export default CartAction;
