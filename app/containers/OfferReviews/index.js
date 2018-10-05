// @flow

import React, { Component } from 'react';

import Link from 'components/Link';
import StarRating from 'components/StarRating';
import CustomSelect from 'components/CustomSelect';
import OfferReview from 'components/OfferReview';

import FILTER_OPTIONS from 'enum/filter/options';

import './styles.scss';

class OfferReviewsContainer extends Component {
  render() {
    return (
      <div className="offerReviews">
        <div className="row align-middle mb-lg">
          <div className="column">
            <h1 className="offerReviews__title">Reviews</h1>
          </div>
          <div className="column shrink">
            <div className="row">
              <div className="column shrink">
                <StarRating initialRating={4} size={23} />
              </div>
              <div className="offerReviews__rating column shrink npl">
                4.0 (234)
              </div>
            </div>
          </div>
          <div className="column shrink">
            <CustomSelect
              className="large fluid"
              onChange={this.onSortChange}
              meta={['model', 'sort']}
              clearable={false}
              value="-createdOn"
              options={FILTER_OPTIONS.FILTER_SORT_OPTIONS}
            />
          </div>
        </div>
        <div className="row">
          <div className="column offerReviews__factor">
            <StarRating className="mb-sm" initialRating={4} size={23} />
            Seller Communication
          </div>
          <div className="column offerReviews__factor">
            <StarRating className="mb-sm" initialRating={4} size={23} />
            Service as Described
          </div>
          <div className="column offerReviews__factor">
            <StarRating className="mb-sm" initialRating={4} size={23} />
            Would Recommend
          </div>
        </div>
        <div className="row">
          <div className="column small-12 np">
            <OfferReview />
          </div>
          <div className="column small-12 np">
            <OfferReview />
          </div>
          <div className="column small-12 np">
            <OfferReview />
          </div>
          <div className="column small-12 np">
            <OfferReview />
          </div>
          <div className="column small-12 np">
            <OfferReview />
          </div>
        </div>
        <div className="row align-center">
          <div className="column shrink">
            <Link className="offerReviews__btnShowMore">Show more</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default OfferReviewsContainer;
