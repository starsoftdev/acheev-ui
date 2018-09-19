// @flow

import * as React from 'react';
import Link from 'components/Link';
import cx from 'classnames';

import StarRating from 'components/StarRating';
import TimeAgo from 'components/TimeAgo';
import getPlainText from 'utils/plainText';

import pluralizeCategory from 'utils/pluralizeCategory';

import './styles.scss';

type Props = {
  data: Object,
  className?: string,
};

const RecentReviewItem = ({ data, className }: Props) => {
  const reviewId = data.get('_id');
  const userAvatar = data.getIn(['user', 'picture']);
  const userName = data.getIn(['user', 'username']);
  const userId = data.getIn(['user', '_id']);
  const userSlug = data.getIn(['user', 'slug']);
  const guestName = data.getIn(['guest', 'name']);
  const productSlug = data.getIn(['product', 'slug']);
  const productName = data.getIn(['product', 'name']);
  const productProducer = data.getIn(['product', 'business', 'name']);
  const rating = data.get('rating');
  const reviewDate = data.get('createdOn');
  const title = data.get('title') ? data.get('title') : null;
  let message = getPlainText(data.get('message'));
  if (!message && rating) {
    message = `${userName} rated this product ${rating}/5`;
  }
  let shortMsg = message;
  if (message.length > 120) {
    shortMsg = `${message.substr(0, 117)}...`;
  }
  const categoryPlural = pluralizeCategory(data.getIn(['product', '__t']));

  return (
    <div className={cx('recentReviewItem', className)}>
      <div className="row align-middle mb-sm">
        <div className="shrink column">
          {userAvatar ? (
            <div
              className="recentReviewItem__smallImage"
              style={{ backgroundImage: `url('${userAvatar}')` }}
            />
          ) : (
            <div className="recentReviewItem__smallImage recentReviewItem__smallImage--default" />
          )}
        </div>
        <div className="shrink column npl">
          {userId ? (
            <Link
              to={`/members/${userSlug}`}
              className="recentReviewItem__userName"
            >
              {userName}
            </Link>
          ) : (
            <div className="t-lowercase fs-xl">{guestName}</div>
          )}
        </div>
      </div>
      <div className="row column">
        <Link
          className="recentReviewItem__productName"
          to={`/${categoryPlural}/${productSlug}`}
        >
          {productName}
        </Link>
      </div>
      <div className="row column mb-sm">
        <div className="recentReviewItem__producer">{productProducer}</div>
      </div>
      <div className="row align-middle mb-md">
        <div className="column shrink">
          <StarRating initialRating={rating} />
        </div>
        <div className="column shrink">
          <TimeAgo data={reviewDate} />
        </div>
      </div>
      <div className="row column">
        <Link
          className="recentReviewItem__title"
          to={`/${categoryPlural}/${productSlug}/reviews/${reviewId}`}
        >
          {title}
        </Link>
      </div>
      <div className="row column">
        <p className="recentReviewItem__short mb-tn">{shortMsg}</p>
      </div>
      <div className="row column">
        <Link to={`/${categoryPlural}/${productSlug}/reviews/${reviewId}`}>
          Read More
        </Link>
      </div>
    </div>
  );
};

export default RecentReviewItem;
