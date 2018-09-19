// @flow

import * as React from 'react';

import Icon from 'components/Icon';

import './styles.scss';

type Props = {
  glyph: string,
  onClick?: Function,
  title: string,
  count: number,
};

const ProductAction = ({ glyph, onClick, title, count = 0 }: Props) => (
  <div className="productAction" onClick={onClick} role="button">
    <Icon className="productAction__icon" glyph={glyph} size={11} />
    {title} ({count})
  </div>
);

export default ProductAction;
