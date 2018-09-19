// @flow

import * as React from 'react';

import Icon from 'components/Icon';

import TypeIcon from 'images/sprite/type.svg';
import './styles.scss';

type Props = {
  data: string,
};

const ProductCard = (props: Props) => {
  const { data } = props;
  if (!data) return null;
  return (
    <div className="productCategory">
      <Icon
        glyph={TypeIcon}
        width={66}
        height={23}
        className={`productCategory__icon productCategory__icon--${data}`}
      />
      <div className="productCategory__text">{data}</div>
    </div>
  );
};

export default ProductCard;
