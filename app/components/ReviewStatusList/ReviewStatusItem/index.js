// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import moment from 'moment';
import cx from 'classnames';

import pluralizeCategory from 'utils/pluralizeCategory';

import './styles.scss';

type Props = {
  data: Object,
};

class ReviewStatusItem extends Component<Props> {
  render() {
    const { data } = this.props;

    const reviewId = data.get('_id');
    let userName = data.getIn(['user', 'username']);
    if (!userName) {
      userName = data.getIn(['guest', 'name']);
    }

    const points = data.getIn(['points']);
    const reviewDate = moment(data.get('createdOn')).format('DD/MM/YYYY');
    const productName = data.getIn(['product', 'name']);
    const productBusinessName = data.getIn(['product', 'business', 'name']);
    const businessName = data.getIn(['business', 'name']);
    const published = data.get('published');

    let reviewStatus = 'pending';
    if (published === true) {
      reviewStatus = 'approved';
    }

    let title = '';
    let targetCategory = '';
    let targetSlug = '';

    if (productName) {
      targetCategory = data.getIn(['product', '__t']);
      targetSlug = data.getIn(['product', 'slug']);
      title = `${productName} (${productBusinessName}) by ${userName}`;
    } else {
      targetCategory = data.getIn(['business', '__t']);
      targetSlug = data.getIn(['business', 'slug']);
      title = `${businessName} by ${userName}`;
    }

    const categoryPlural = pluralizeCategory(targetCategory);

    return (
      <div
        className={cx(
          'reviewStatusItem row mb-md',
          `reviewStatusItem--${reviewStatus}`
        )}
      >
        <div className="column small-12 medium-expand reviewStatusItem__titleSection">
          <Link
            to={`/${categoryPlural}/reviews/${targetSlug}/${reviewId}`}
            className="reviewStatusItem__title"
          >
            {title}
          </Link>
        </div>
        <div className="column small-6 medium-1">
          <strong>{points} pts</strong>
        </div>
        <div className="column small-6 medium-shrink reviewStatusItem__statusSection">
          <div className="reviewStatusItem__date">{reviewDate}</div>
          <div
            className={cx(
              'reviewStatusItem__statusIcon',
              `reviewStatusItem__statusIcon--${reviewStatus}`
            )}
          >
            {reviewStatus}
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewStatusItem;
