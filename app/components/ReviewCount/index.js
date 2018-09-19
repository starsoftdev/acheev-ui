// @flow

import * as React from 'react';
import cx from 'classnames';

import Link from 'components/Link';
import StarRating from 'components/StarRating';
import Icon from 'components/Icon';

import './styles.scss';

type Props = {
  reviewCount: number,
  ratingsAverage: number,
  className?: string,
  to?: string,
  prefixIcon?: string,
  type?: string,
  centered?: boolean,
};

const ReviewCount = ({
  reviewCount,
  ratingsAverage,
  className,
  to,
  prefixIcon,
  type,
  centered,
}: Props) => {
  const mergedClassName = cx('reviewCount row align-middle', className);
  const starsClassName = cx('reviewCount__starsContainer row align-middle', {
    'align-center': centered,
  });
  return (
    <div className={mergedClassName}>
      <div className="reviewCount__starSection column small-12 medium-shrink">
        <div className={starsClassName}>
          {prefixIcon && (
            <div className="shrink column npr">
              <Icon
                glyph={prefixIcon}
                size={20}
                className="reviewCount__icon"
              />
            </div>
          )}
          <div className="shrink column">
            <StarRating
              className="reviewCount__star"
              initialRating={ratingsAverage}
            />
          </div>
        </div>
      </div>
      <div className="reviewCount__countSection column small-12 medium-shrink">
        {ratingsAverage ? (
          <strong>({ratingsAverage})&nbsp;&nbsp;&nbsp;</strong>
        ) : (
          <strong>(0)&nbsp;&nbsp;&nbsp;</strong>
        )}
        <Link to={to}>
          {reviewCount} {type ? `${type} ` : ''}reviews
        </Link>
      </div>
    </div>
  );
};

export default ReviewCount;
