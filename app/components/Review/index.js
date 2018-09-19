// @flow

import React, { Component } from 'react';
import Link from 'components/Link';

import ReviewCount from 'components/ReviewCount';
import ReviewCompletion from 'components/ReviewCompletion';

import pluralizeCategory from 'utils/pluralizeCategory';

import './styles.scss';

type Props = {
  data: Object,
  reviewCompletion?: Object,
  children?: React.Element<any>,
};

class Review extends Component<Props> {
  render() {
    const { data, reviewCompletion, children } = this.props;

    const name = data.get('name');
    const reviewCount = data.get('reviews') ? data.get('reviews').size : 0;
    const url = window.location.href;
    const isCreateReview = url.includes('create-review');
    const category =
      data && data.get('__t') ? data.get('__t').toLowerCase() : 'product';
    const categoryPlural = pluralizeCategory(category);
    const slug = data && data.get('slug');
    const rating = data.get('rating');
    return (
      <div className="createReview mb-md">
        <div className="row">
          <div className="column small-12 medium-12 large-10 large-offset-1">
            <div className="row align-middle mb-sm">
              <div className="column">
                <h1 className="c-darkest-gray t-capitalize">{name}</h1>
              </div>
            </div>
            {!isCreateReview && (
              <div className="createReview__infoSection row mb-md">
                <div className="column">
                  <div className="row align-middle mb-md">
                    <ReviewCount
                      className="createReview__rating"
                      reviewCount={reviewCount}
                      ratingsAverage={rating}
                      to={`/${categoryPlural}/${slug}/reviews`}
                    />
                  </div>
                </div>
              </div>
            )}
            {children}
          </div>
          {false && (
            <div className="column small-12 medium-4 large-3 large-offset-1">
              {reviewCompletion && (
                <div className="mb-lg">
                  <ReviewCompletion reviewCompletion={reviewCompletion} />
                </div>
              )}
              <div className="fs-mx c-green mb-mn">New to Lift Rewards?</div>
              <div className="mb-lg">
                Writing a high quality review will earn you more Lift Points,
                which you can use to unlock special Rewards, including discounts
                at licensed producers or cannabis vaporizers and accessories
                from our online store.
              </div>
              <Link className="button" to="/rewards">
                Learn More
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Review;
