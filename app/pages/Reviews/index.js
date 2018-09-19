// @flow

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { List, fromJS, Map } from 'immutable';
import { push } from 'react-router-redux';
import qs from 'qs';

import injectSagas from 'utils/injectSagas';

import Breadcrumbs from 'components/Breadcrumbs';
import Banner from 'components/PageBanner';
import Pagination from 'components/Pagination';
import ReviewList from 'components/ReviewList';
import ReviewsBannerFilter from 'components/ReviewsBannerFilter';

import FILTER_OPTIONS from 'enum/filter/options';

import saga, {
  reducer,
  requestReviews,
  sortReview,
  changeReviewCategory,
  deleteReview,
  voteReview,
  setFilters,
} from './sagas';

type Props = {
  currentUser: Object,
  requestReviews: Function,
  deleteReview: Function,
  voteReview: Function,
  reviews: List<*>,
  isLoading: boolean,
  review: Object,
  reviewVote: Object,
  category: string,
  sortReview: Function,
  changeReviewCategory: Function,
  reviewsSortBy: string,
  reviewsPages: number,
  setFilters: Function,
  push: Function,
  location: Object,
  model: Map<string, Object>,
  reviewsPage: number,
};

class ReviewsPage extends Component<Props> {
  componentDidMount() {
    this.props.setFilters(qs.parse(this.props.location.query));
    this.props.requestReviews();
  }

  componentWillReceiveProps({
    reviewsSortBy,
    category,
    model,
    review,
    reviewVote,
  }) {
    if (!model.equals(this.props.model)) {
      this.props.push({
        pathname: this.props.location.pathname,
        search: `?${qs.stringify({
          category: model.get('category'),
          page: model.get('page'),
          per_page: model.get('per_page'),
          sort: model.get('sortBy'),
        })}`,
      });
    }

    const wasUpdatingReview = review.get('isLoading');
    const isReviewUpdated =
      this.props.review.get('isLoading') === false &&
      this.props.review.get('error') === '';

    const wasVotingReview = reviewVote.get('isLoading');
    const isReviewVoted =
      this.props.reviewVote.get('isLoading') === false &&
      this.props.reviewVote.get('error') === '';

    if (reviewsSortBy !== this.props.reviewsSortBy) {
      this.props.requestReviews();
    }

    if (category !== this.props.category) {
      this.props.requestReviews();
    }

    if (
      this.props.reviews &&
      wasUpdatingReview === true &&
      isReviewUpdated === true
    ) {
      this.props.requestReviews();
    }

    if (
      this.props.reviews &&
      wasVotingReview === true &&
      isReviewVoted === true
    ) {
      this.props.requestReviews();
    }
  }

  render() {
    const {
      reviews,
      isLoading,
      category,
      reviewsPages,
      reviewsSortBy,
      reviewsPage,
      currentUser,
    } = this.props;
    const bannerTitle = 'Read the latest reviews';
    const bannerDescription = 'All reviews, in one place.';
    const helmetTitle = 'Reviews - Lift & Co.';
    return (
      <div className="reviewsPage">
        <Helmet title={helmetTitle}>
          <meta
            name="description"
            content="Find the right medical marijuana strain for you by reading through our database of detailed consumer reviews. Understand the conditions and effects hundreds of medical marijuana strains have on our growing medical marijuana community members."
          />
        </Helmet>
        <Breadcrumbs
          path={fromJS([
            {
              link: '',
              title: 'Reviews',
            },
          ])}
        />
        <Banner
          className="large nm"
          title={bannerTitle}
          titleElement="h2"
          subtitle={bannerDescription}
          expanded
          responsiveBg
        />
        <ReviewsBannerFilter
          typeOptions={FILTER_OPTIONS.REVIEW_TYPE_OPTIONS}
          typeValue={category}
          changeType={this.props.changeReviewCategory}
          sortOptions={FILTER_OPTIONS.REVIEW_SORT_OPTIONS}
          sortValue={reviewsSortBy}
          sort={this.props.sortReview}
        />
        <section>
          <ReviewList
            data={reviews}
            category={category}
            isLoading={isLoading}
            currentUser={currentUser}
            deleteReview={this.props.deleteReview}
            voteReview={this.props.voteReview}
            context="public"
          />
        </section>
        <Pagination
          forcePage={reviewsPage}
          pageCount={reviewsPages}
          onPageChange={e => this.props.requestReviews(['page'], e)}
        />
      </div>
    );
  }
}

const mapStateToPtops = state => ({
  currentUser: state.getIn(['app', 'user']),
  isLoading: state.getIn(['reviews', 'isLoading']),
  category: state.getIn(['reviews', 'model', 'category']),
  reviews: state.getIn(['reviews', 'data', 'hits']),
  reviewsPages: state.getIn(['reviews', 'data', 'pages']),
  reviewsSortBy: state.getIn(['reviews', 'model', 'sortBy']),
  reviewsPage: state.getIn(['reviews', 'model', 'page']),
  review: state.getIn(['reviews', 'review']),
  reviewVote: state.getIn(['reviews', 'reviewVote']),
  model: state.getIn(['reviews', 'model']),
});

const mapDispatchToProps = dispatch => ({
  requestReviews: (path, value) => dispatch(requestReviews(path, value)),
  sortReview: sortBy => dispatch(sortReview(sortBy)),
  changeReviewCategory: category => dispatch(changeReviewCategory(category)),
  voteReview: (reviewId, type) => dispatch(voteReview(reviewId, type)),
  deleteReview: reviewId => dispatch(deleteReview(reviewId)),
  setFilters: parsedSearch => dispatch(setFilters(parsedSearch)),
  push: query => dispatch(push(query)),
});

export default compose(
  injectSagas({ key: 'reviews', saga, reducer }),
  connect(
    mapStateToPtops,
    mapDispatchToProps
  )
)(ReviewsPage);
