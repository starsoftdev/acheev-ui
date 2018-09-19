// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { history } from 'components/ConnectedRouter';
import { generate } from 'shortid';
import { fromJS, List } from 'immutable';
import type { Map } from 'immutable';
import { push } from 'react-router-redux';
import qs from 'qs';
import { get } from 'utils/immutable';

import ReviewList from 'components/ReviewList';
import Pagination from 'components/Pagination';
import ReviewSort from 'components/Sort';
import BorderedTitle from 'components/BorderedTitle';
import Tab from 'components/RouterTab';
import ButtonGroup from 'components/ButtonGroup';
import Select from 'components/Select';
import NoReviewBanner from 'components/NoReviewBanner';

import {
  requestBusinessReviews,
  voteReview,
  deleteReview,
  setBreadcrumbPath,
  setReviewsFilters,
} from 'containers/BusinessProfile/sagas';

import { setMetaJson } from 'containers/App/sagas';

import FILTER_OPTIONS from 'enum/filter/options';

type Props = {
  category: string,
  type: string,
  isLoading: boolean,
  isLoadingReviews: boolean,
  business: Map<*, *>,
  reviews: List<Map<string, Object>>,
  reviewPages: number,
  reviewPage: number,
  reviewsSortBy: string,
  review: Object,
  reviewVote: Object,
  slug: string,
  requestBusinessReviews: Function,
  deleteReview: Function,
  voteReview: Function,
  currentUser: Object,
  setBreadcrumbPath: Function,
  setMetaJson: Function,
  setReviewsFilters: Function,
  push: Function,
  model: Map<string, Object>,
  location: Object,
};

class ReviewListContainer extends Component<Props> {
  componentDidMount() {
    const { business, type } = this.props;
    this.props.setReviewsFilters(qs.parse(this.props.location.query));

    if (get(business, 'id')) {
      this.props.requestBusinessReviews(business.get('id'), type);
      this.setBreadcrumbPath(business);
    }
  }

  componentDidUpdate({
    business,
    reviewVote,
    review,
    reviewsSortBy,
    isLoadingReviews,
    type,
    model,
    isLoading,
  }: Props) {
    if (!this.props.model.equals(model)) {
      this.props.push({
        pathname: this.props.location.pathname,
        search: `?${qs.stringify({
          page: this.props.model.get('page'),
          per_page: this.props.model.get('per_page'),
          sort: this.props.model.get('sortBy'),
        })}`,
      });
      return;
    }
    let reviewMeta = [];

    const wasLoadingProfile = isLoading;
    const isProfileLoaded =
      this.props.isLoading === false &&
      !!this.props.business &&
      !!this.props.business.get('id');

    const wasVotingReview = reviewVote.get('isLoading');
    const isReviewVoted =
      this.props.reviewVote.get('isLoading') === false &&
      this.props.reviewVote.get('error') === '';

    const wasUpdatingReview = review.get('isLoading');
    const isReviewUpdated =
      this.props.review.get('isLoading') === false &&
      this.props.review.get('error') === '';

    if (
      this.props.isLoadingReviews === false &&
      wasLoadingProfile &&
      isProfileLoaded
    ) {
      this.props.requestBusinessReviews(
        this.props.business.get('id'),
        this.props.type
      );
      this.setBreadcrumbPath(this.props.business);
    }

    if (isLoadingReviews && !this.props.isLoadingReviews) {
      reviewMeta = this.props.reviews.toJS().map(item => {
        let author = '';
        if (item.user && item.user.fullName) {
          author = item.user.fullName;
        } else if (item.user) {
          author = item.user.username;
        } else if (item.guest) {
          author = item.guest.name;
        } else {
          author = '';
        }

        return {
          '@type': 'Review',
          author,
          datePublished: item.createdOn,
          reviewBody: item.message,
          name: item.title,
          reviewRating: {
            '@type': 'Rating',
            bestRating: 5,
            ratingValue: item.rating,
            worstRating: 0,
          },
        };
      });
      this.props.setMetaJson(['mainEntity', 'review'], reviewMeta);
    }

    if (business && wasVotingReview && isReviewVoted) {
      this.props.requestBusinessReviews(business.get('id'), type);
    }

    if (business && wasUpdatingReview === true && isReviewUpdated) {
      this.props.requestBusinessReviews(business.get('id'), type);
    }

    if (this.props.reviewsSortBy !== reviewsSortBy) {
      this.props.requestBusinessReviews(business.get('id'), type);
    }
  }

  setBreadcrumbPath = (data: Object) => {
    const { slug, category } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '/busineses',
        title: 'Businesses',
      },
      {
        link: `/${category}`,
        title: category,
      },
      {
        link: `/${category}/${slug}`,
        title: get(data, 'name', ''),
      },
      {
        link: '',
        title: 'Reviews',
      },
    ]);
    this.props.setBreadcrumbPath(breadcrumbPath);
  };

  sortReviews = sortBy => {
    const { reviewsSortBy, business, type } = this.props;
    const businessId = business.get('id');
    if (businessId && sortBy !== reviewsSortBy) {
      this.props.requestBusinessReviews(businessId, type, ['sortBy'], sortBy);
    }
  };

  render() {
    const {
      category,
      business,
      reviews,
      reviewPages,
      reviewPage,
      reviewsSortBy,
      isLoadingReviews,
      slug,
      currentUser,
      type,
    } = this.props;

    const baseUrl = `/${category}/${slug}`;

    const businessId = business.get('id');

    let reviewsCount = 0;
    if (reviews) {
      reviewsCount = reviews.size;
    }
    const options = ['About', 'Reviews'];
    if (category === 'producers') {
      options.push('Products');
    }
    let totalReviewsCount =
      get(business, 'reviews') && get(business, 'reviews').size;
    if (type === 'product') {
      totalReviewsCount = business.get('productReviewCount');
    }
    const reviewCount = get(business, 'reviewCount');
    return (
      <div>
        <ButtonGroup className="centered mb-lg hide-for-small-only">
          <Tab to={baseUrl}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>
            {category === 'producers' ? 'Business Reviews' : 'Reviews'}
          </Tab>
          {category === 'producers' && [
            <Tab key={generate()} to={`${baseUrl}/product-reviews`}>
              Product Reviews
            </Tab>,
            <Tab key={generate()} to={`${baseUrl}/products`}>
              Products
            </Tab>,
          ]}
        </ButtonGroup>
        <div className="row">
          <div className="column">
            <Select
              className="blackTheme mb-lg show-for-small-only b-primary"
              value="Reviews"
              onChange={e => {
                if (e.target.value === 'About') {
                  history.push(baseUrl);
                } else {
                  history.push(`${baseUrl}/${e.target.value.toLowerCase()}`);
                }
              }}
            >
              {options.map(item => (
                <option key={generate()} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="row column">
          {totalReviewsCount ? (
            <div>
              <BorderedTitle>
                Showing {reviewsCount} of {totalReviewsCount} reviews
              </BorderedTitle>
              <ReviewSort
                options={FILTER_OPTIONS.REVIEW_SORT_OPTIONS}
                value={reviewsSortBy}
                sort={this.sortReviews}
              />
              <ReviewList
                data={reviews}
                category={category}
                slug={slug}
                isLoading={isLoadingReviews}
                currentUser={currentUser}
                deleteReview={this.props.deleteReview}
                voteReview={this.props.voteReview}
                context={type === 'product' ? 'public' : ''}
              />
            </div>
          ) : (
            <BorderedTitle>No reviews yet</BorderedTitle>
          )}

          <Pagination
            forcePage={reviewPage}
            pageCount={reviewPages}
            onPageChange={e =>
              this.props.requestBusinessReviews(businessId, type, ['page'], e)
            }
          />
        </div>
        {reviewCount < 5 && (
          <NoReviewBanner to={`${baseUrl}/create-review`} type="business" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  isLoading: state.getIn(['profile', 'business', 'isLoading']),
  error: state.getIn(['profile', 'business', 'error']),
  reviews: state.getIn(['profile', 'reviews', 'data', 'hits']),
  reviewPages: state.getIn(['profile', 'reviews', 'data', 'pages']),
  reviewPage: state.getIn(['profile', 'reviews', 'model', 'page']),
  reviewsSortBy: state.getIn(['profile', 'reviews', 'model', 'sortBy']),
  review: state.getIn(['profile', 'review']),
  isLoadingReviews: state.getIn(['profile', 'reviews', 'isLoading']),
  reviewVote: state.getIn(['profile', 'reviewVote']),
  businessFollowLike: state.getIn(['profile', 'businessFollowLike']),
  follows: state.getIn(['profile', 'follows']),
  likes: state.getIn(['profile', 'likes']),
  model: state.getIn(['profile', 'reviews', 'model']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinessReviews: (category, type, id, value) =>
    dispatch(requestBusinessReviews(category, type, id, value)),
  voteReview: (reviewId, type) => dispatch(voteReview(reviewId, type)),
  deleteReview: reviewId => dispatch(deleteReview(reviewId)),
  setBreadcrumbPath: path => dispatch(setBreadcrumbPath(path)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
  setReviewsFilters: parsedSearch => dispatch(setReviewsFilters(parsedSearch)),
  push: query => dispatch(push(query)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewListContainer);
