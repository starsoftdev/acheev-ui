// @flow

import * as React from 'react';
import { history } from 'components/ConnectedRouter';
import Dotdotdot from 'react-dotdotdot';

import Icon from 'components/Icon';
import StarRating from 'components/StarRating';
import Button from 'components/Button';
import Link from 'components/Link';

import IconIndica from 'images/sprite/Icon-Indica-1.svg';
import IconHybrid from 'images/sprite/Icon-Hybrid-1.svg';
import IconSativa from 'images/sprite/Icon-Sativa-1.svg';
import IconOilIndica from 'images/sprite/Icon-Oil-Indica.svg';
import IconOilHybrid from 'images/sprite/Icon-Oil-Hybrid.svg';
import IconOilSativa from 'images/sprite/Icon-Oil-Sativa.svg';

import './styles.scss';

type Props = {
  data: Object,
};

const categoryIcons = {
  Strain: {
    indica: IconIndica,
    hybrid: IconHybrid,
    sativa: IconSativa,
  },
  Oil: {
    indica: IconOilIndica,
    hybrid: IconOilHybrid,
    sativa: IconOilSativa,
  },
};

const RecommendProductCard = (props: Props) => {
  const { data } = props;
  const producer = data.getIn(['business', 'name']);
  const businessSlug = data.getIn(['business', 'slug']);
  const productCategory = data.get('__t');
  const category = data.get('category');
  const categoryIcon = categoryIcons[productCategory][category];

  return (
    <div className="recommendProductCard">
      <div className="recommendProductCard__category">
        <Icon glyph={categoryIcon} size={24} className="mr-sm" />
        {category}
      </div>
      <h4 className="recommendProductCard__title f-primary mb-mn">
        <Dotdotdot clamp={2}>{data.get('name')}</Dotdotdot>
      </h4>

      <Link
        to={`/producers/${businessSlug}`}
        className="recommendProductCard__producer mb-mn"
      >
        {producer}
      </Link>

      <div className="recommendProductCard__cannabisoids mb-mn">
        <div>
          <strong>THC</strong>
          <span>{data.get('thc')}</span>
        </div>
        <div>
          <strong>CBD</strong>
          <span>{data.get('cbd')}</span>
        </div>
      </div>
      <div className="recommendProductCard__review row align-middle align-center mb-md">
        <StarRating className="mr-tn" initialRating={data.get('rating')} />
        <span>{data.get('reviewCount')}</span>
      </div>
      <div className="text-center">
        <Button
          className="secondary small"
          onClick={() =>
            history.push(
              `/${productCategory.toLowerCase()}s/${data.get('slug')}`
            )
          }
        >
          View
        </Button>
      </div>
    </div>
  );
};

export default RecommendProductCard;
