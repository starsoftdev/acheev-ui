// @flow

import React from 'react';

import Link from 'components/Link';
import Icon from 'components/Icon';

import './styles.scss';

type Props = {
  data: Object,
};

const CategoryCard = ({ data }: Props) => (
  <div className="categoryCard">
    <Link
      to={`/offers/${data.get('slug')}`}
      className="categoryCard__content"
      style={{
        backgroundImage: `url(${data.get('background')})`,
      }}
    >
      <div className="row column">
        <Icon
          className="categoryCard__icon hide-for-small-only"
          glyph={data.get('icon')}
          size={116}
        />
        <Icon
          className="categoryCard__icon show-for-small-only"
          glyph={data.get('icon')}
          size={50}
        />
      </div>
      <div className="row column">
        <h2 className="categoryCard__name">{data.get('name')}</h2>
      </div>
    </Link>
  </div>
);

export default CategoryCard;
