// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import BusinessReviewForm from 'containers/ReviewForm';
import Preloader from 'components/Preloader';

import injectSagas from 'utils/injectSagas';

import saga, {
  reducer,
  requestBusinessProfile,
  submitReview,
  requestReview,
  completeReviewForm,
  clearReviewForm,
} from 'containers/BusinessProfile/sagas';

type Props = {
  category: string,
  slug: string,
  match: Object,
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

const normalizedCategory = {
  producers: 'producer',
  clinics: 'doctor',
};

class BusinessReviewFormPage extends Component<Props> {
  componentDidMount() {
    if (!this.props.business) {
      this.props.requestBusinessProfile(this.props.match.params.slug);
    }
  }

  render() {
    const {
      match: { params },
      business,
      isLoading,
      error,
      review,
      reviewData,
      currentUser,
      reviewCompletion,
      category,
    } = this.props;

    if (!business) {
      return <Preloader />;
    }

    return (
      <BusinessReviewForm
        category={normalizedCategory[category]}
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

export default compose(
  injectSagas({ key: 'profile', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(BusinessReviewFormPage);
