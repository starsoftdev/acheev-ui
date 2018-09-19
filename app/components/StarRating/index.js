// @flow

import * as React from 'react';
import Rating from 'react-rating';
import cx from 'classnames';

import Icon from 'components/Icon';

import Star from 'images/sprite/star.svg';
import StarHollow from 'images/sprite/star-hollow.svg';
import './styles.scss';

type Props = {
  initialRating: number,
  className?: string,
  onChange?: Function,
  readonly?: boolean,
  size?: number,
};

const StarRating = ({
  initialRating,
  className,
  readonly = true,
  onChange,
  size = 16,
}: Props) => {
  const mergedClassName = cx('starRating', className);
  const roundedRating = Math.round(initialRating * 2) / 2;
  return (
    <div className={mergedClassName}>
      <Rating
        initialRating={roundedRating}
        readonly={readonly}
        onChange={onChange}
        fractions={2}
        emptySymbol={<Icon glyph={StarHollow} size={size} />}
        fullSymbol={<Icon glyph={Star} size={size} />}
      />
    </div>
  );
};

export default StarRating;
