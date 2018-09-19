// @flow

import * as React from 'react';
import { List, Map } from 'immutable';
import cx from 'classnames';

import ProductCard from 'components/ProductCardAlt';
import './styles.scss';

type Props = {
  data: List<Map<string, Object>>,
  className?: string,
};

const ProductsList = ({ data, className }: Props) => (
  <div className={cx('row small-12 align-center', className)}>
    {data &&
      data.valueSeq().map(value => (
        <div
          className="column small-12 medium-6 large-3 mb-lg"
          key={value.get('id')}
        >
          <ProductCard data={value} />
        </div>
      ))}
  </div>
);

export default ProductsList;
