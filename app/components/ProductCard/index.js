// @flow
import * as React from 'react';
import { history } from 'components/ConnectedRouter';
import Dotdotdot from 'react-dotdotdot';
import { isEmpty } from 'lodash-es';

import Tooltip from 'components/Tooltip';
import ReviewCount from 'components/ReviewCount';
import Cannabinoids from 'components/Cannabinoids';
import Icon from 'components/Icon';
import Button from 'components/Button';
import Link from 'components/Link';

import IconIndica from 'images/sprite/Icon-Indica.svg';
import IconHybrid from 'images/sprite/Icon-Hybrid.svg';
import IconSativa from 'images/sprite/Icon-Sativa.svg';
import IconOil from 'images/sprite/Icon-Oil.svg';
import IconOilIndica from 'images/sprite/Icon-Oil-Indica.svg';
import IconOilHybrid from 'images/sprite/Icon-Oil-Hybrid.svg';
import IconOilSativa from 'images/sprite/Icon-Oil-Sativa.svg';
import IconAward from 'images/sprite/Laurel.svg';

import CONFIG from '../../conf';
import './styles.scss';

const categoryIcons = {
  Oil: {
    oil: IconOil,
    indica: IconOilIndica,
    hybrid: IconOilHybrid,
    sativa: IconOilSativa,
  },
  Strain: {
    indica: IconIndica,
    hybrid: IconHybrid,
    sativa: IconSativa,
  },
  Accessory: {
    accessories: {}, // don't show Icon
  },
};

type Props = {
  data: Object,
  hideReview?: boolean,
};

const ProductCard = (props: Props) => {
  const { data, hideReview = false } = props;
  const producer = data.getIn(['business', 'name']);
  const businessSlug = data.getIn(['business', 'slug']);
  const productCategory = data.get('__t');
  let category = data.get('category');
  if (!productCategory) {
    category = 'accessories';
  }
  if (productCategory === 'Oil' && !category) {
    category = 'oil';
  }
  const categoryIcon = productCategory
    ? categoryIcons[productCategory][category]
    : {};
  const baseUrl = productCategory
    ? `/${productCategory.toLowerCase()}s`
    : '/accessories';
  const slug = data.get('slug');
  const changeRouteWithSlug = () => {
    history.push(`${baseUrl}/${slug}`);
  };
  const thumbnail =
    data.get('thumbnail') || data.getIn(['business', 'thumbnail']);
  const available = data.getIn(['variants', '0', 'available']);
  const availabilityStatus = data.getIn([
    'variants',
    '0',
    'availabilityStatus',
  ]);
  const hasAward = data.get('awards') && data.get('awards').size > 0;
  if (isEmpty(data.toJS())) return null;
  return (
    <div className="productCard">
      <Link className="productCard__link" to={`${baseUrl}/${slug}`}>
        {category ? (
          <Tooltip
            tooltipPosition="top"
            tooltipIndicator={false}
            tooltipContent={category}
            triggerFocus={false}
            triggerClick={false}
          >
            <div
              className="productCard__image"
              style={{
                backgroundImage: `url('${
                  CONFIG.APP.CDN_URL
                }/resize/78x78/${thumbnail}')`,
              }}
            >
              {hasAward && (
                <Icon
                  glyph={IconAward}
                  size={50}
                  className="productCard__awardBadge"
                />
              )}
              {categoryIcon && (
                <Icon
                  glyph={categoryIcon}
                  size={30}
                  className="productCard__categoryIcon"
                />
              )}
            </div>
          </Tooltip>
        ) : (
          <div
            className="productCard__image"
            style={{
              backgroundImage: `url('${
                CONFIG.APP.CDN_URL
              }/resize/78x78/${thumbnail}')`,
            }}
          />
        )}
        <h4 className="productCard__title">
          <Dotdotdot clamp={2}>{data.get('name')}</Dotdotdot>
        </h4>
      </Link>
      {producer && (
        <Link
          to={`/producers/${businessSlug}`}
          className="productCard__producer"
        >
          {producer}
        </Link>
      )}
      <Cannabinoids
        thc={data.get('thcHigh')}
        cbd={data.get('cbdHigh')}
        category={productCategory}
      />

      {!hideReview && (
        <ReviewCount
          className="align-center mb-mn"
          reviewCount={data.get('reviews').size}
          ratingsAverage={data.get('rating')}
          to={`${baseUrl}/${slug}/reviews`}
          centered
        />
      )}
      <div className="row">
        <div className="column text-center">
          {!available && availabilityStatus === 'discontinued' ? (
            <Button
              className="productCard__buttonAvailability"
              onClick={() => changeRouteWithSlug()}
            >
              {availabilityStatus}
            </Button>
          ) : (
            <Button
              className="secondary small"
              onClick={() => changeRouteWithSlug()}
            >
              View
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
