// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map, List } from 'immutable';

import {
  requestReviews,
  sortReview,
  changeReviewCategory,
  deleteReview,
  voteReview,
} from 'pages/MemberProfile/sagas';
import Pagination from 'components/Pagination';
import ReviewList from 'components/ReviewList';
import ReviewsBannerFilter from 'components/ReviewsBannerFilter';

import FILTER_OPTIONS from 'enum/filter/options';

type Props = {
  reviews: List<*>,
  isLoading: boolean,
  review: Object,
  reviewVote: Object,
  category: string,
  reviewsSortBy: string,
  reviewsPages: number,
  profile: Map<string, string>,
  currentUser: Object,
  requestReviews: Function,
  sortReview: Function,
  changeReviewCategory: Function,
  deleteReview: Function,
  voteReview: Function,
  slug: string,
};

class MemberProfileReviews extends Component<Props> {
  componentDidMount() {
    if (this.props.profile.get('data')) {
      this.props.requestReviews(
        this.props.profile.getIn(['data', 'hits', 0, '_id'])
      );
    }
  }
  componentWillReceiveProps({
    profile,
    reviewsSortBy,
    category,
    reviews,
    review,
    reviewVote,
  }) {
    const wasLoadingProfile = this.props.profile.get('isLoading');
    const isProfileLoaded =
      profile.get('isLoading') === false && profile.get('data');

    const wasUpdatingReview = this.props.review.get('isLoading');
    const isReviewUpdated =
      review.get('isLoading') === false && review.get('error') === '';

    const wasVotingReview = this.props.reviewVote.get('isLoading');
    const isReviewVoted =
      reviewVote.get('isLoading') === false && reviewVote.get('error') === '';

    if (wasLoadingProfile && isProfileLoaded) {
      this.props.requestReviews(profile.getIn(['data', 'hits', 0, '_id']));
    }

    if (reviewsSortBy !== this.props.reviewsSortBy) {
      this.props.requestReviews(profile.getIn(['data', 'hits', 0, '_id']));
    }

    if (category !== this.props.category) {
      this.props.requestReviews(profile.getIn(['data', 'hits', 0, '_id']));
    }

    if (reviews && wasUpdatingReview === true && isReviewUpdated === true) {
      this.props.requestReviews(profile.getIn(['data', 'hits', 0, '_id']));
    }

    if (reviews && wasVotingReview === true && isReviewVoted === true) {
      this.props.requestReviews(profile.getIn(['data', 'hits', 0, '_id']));
    }
  }
  render() {
    const {
      reviews,
      isLoading,
      category,
      reviewsPages,
      reviewsSortBy,
      profile,
      currentUser,
      slug,
    } = this.props;
    return (
      <div>
        <ReviewsBannerFilter
          typeOptions={FILTER_OPTIONS.REVIEW_TYPE_OPTIONS}
          typeValue={category}
          changeType={this.props.changeReviewCategory}
          sortOptions={FILTER_OPTIONS.REVIEW_SORT_OPTIONS}
          sortValue={reviewsSortBy}
          sort={this.props.sortReview}
        />
        <ReviewList
          data={reviews}
          category={category}
          isLoading={isLoading}
          currentUser={currentUser}
          deleteReview={this.props.deleteReview}
          voteReview={this.props.voteReview}
          context="public"
          slug={slug}
        />
        <Pagination
          pageCount={reviewsPages}
          onPageChange={e =>
            this.props.requestReviews(
              profile.getIn(['data', 'hits', 0, '_id']),
              ['page'],
              e
            )
          }
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['memberProfile', 'reviews', 'isLoading']),
  category: state.getIn([
    'memberProfile',
    'reviews',
    'filter',
    'model',
    'category',
  ]),
  reviews: state.getIn(['memberProfile', 'reviews', 'data', 'hits']),
  reviewsPages: state.getIn(['memberProfile', 'reviews', 'data', 'pages']),
  reviewsSortBy: state.getIn([
    'memberProfile',
    'reviews',
    'filter',
    'model',
    'sortBy',
  ]),
  review: state.getIn(['memberProfile', 'reviews', 'review']),
  reviewVote: state.getIn(['memberProfile', 'reviews', 'reviewVote']),
  profile: state.getIn(['memberProfile', 'profile']),
  currentUser: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  requestReviews: (userId, path, value) =>
    dispatch(requestReviews(userId, path, value)),
  sortReview: sortBy => dispatch(sortReview(sortBy)),
  changeReviewCategory: category => dispatch(changeReviewCategory(category)),
  voteReview: (reviewId, type) => dispatch(voteReview(reviewId, type)),
  deleteReview: reviewId => dispatch(deleteReview(reviewId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberProfileReviews);
