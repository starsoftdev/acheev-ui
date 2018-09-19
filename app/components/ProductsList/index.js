// @flow

import * as React from 'react';
import { List, Map } from 'immutable';
import cx from 'classnames';

import ProductCard from 'components/ProductCard';
import './styles.scss';

type Props = {
  data: List<Map<string, Object>>,
  noBorder?: boolean,
  itemClassName?: string,
};

const ProductsList = ({ data, itemClassName = '', noBorder }: Props) => (
  <div className="productsList row align-stretch">
    {data &&
      data.entrySeq().map((
        [key, value] // see https://github.com/facebook/immutable-js/issues/667 for detailed description
      ) => (
        <div
          className={cx(
            'productsList__item small-12 medium-6 large-3 column',
            itemClassName,
            {
              'productsList__item--noBorder': noBorder,
            }
          )}
          key={key}
        >
          <ProductCard
            data={value.get('item') ? value.get('item') : value}
            noBorder
          />
        </div>
      ))}
  </div>
);

export default ProductsList;
