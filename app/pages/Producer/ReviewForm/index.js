// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import BusinessReviewForm from 'containers/ReviewForm';

import {
  requestBusinessProfile,
  submitReview,
  requestReview,
  completeReviewForm,
  clearReviewForm,
} from 'containers/BusinessProfile/sagas';

type Props = {
  params: Object,
  isLoading: boolean,
  error: string,
  business: Object,
  review: Object,
  reviewData: Object,
  requestBusinessProfile: Function,
  submitReview: Function,
  requestReview: Function,
  currentUser: Object,
  reviewCompletion: Object,
  completeReviewForm: Function,
  clearReviewForm: Function,
};

class ProducerReviewFormPage extends Component<Props> {
  render() {
    const {
      params,
      business,
      isLoading,
      error,
      review,
      reviewData,
      currentUser,
      reviewCompletion,
    } = this.props;
    return (
      <BusinessReviewForm
        category="producer"
        slug={params.slug}
        reviewId={params.id}
        data={business}
        isLoading={isLoading}
        error={error}
        review={review}
        reviewData={reviewData}
        reviewCompletion={reviewCompletion}
        requestData={this.props.requestBusinessProfile}
        submitReview={this.props.submitReview}
        requestReview={this.props.requestReview}
        completeReviewForm={this.props.completeReviewForm}
        clearReviewForm={this.props.clearReviewForm}
        currentUser={currentUser}
      />
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  business: state.getIn(['profile', 'business', 'data']),
  isLoading: state.getIn(['profile', 'business', 'isLoading']),
  error: state.getIn(['profile', 'business', 'error']),
  review: state.getIn(['profile', 'review']),
  reviewData: state.getIn(['profile', 'reviewData']),
  reviewCompletion: state.getIn(['profile', 'reviewCompletion']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinessProfile: (slug, value) =>
    dispatch(requestBusinessProfile(slug, value)),
  submitReview: (payload, reviewId) =>
    dispatch(submitReview(payload, reviewId)),
  requestReview: id => dispatch(requestReview(id)),
  completeReviewForm: (path, value) =>
    dispatch(completeReviewForm(path, value)),
  clearReviewForm: () => dispatch(clearReviewForm()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ProducerReviewFormPage
);
