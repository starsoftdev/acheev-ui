// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';

import NewProductReviewForm from 'components/NewProductReviewForm';

import Preloader from 'components/Preloader';
import NotFound from 'pages/NotFound';

type Props = {
  category: string,
  isLoading: boolean,
  error: string,
  submitError: string,
  submitSuccess: string,
  data: Object,
  review: Object,
  reviewData: Object,
  reviewDraft: Object,
  reviewId: string,
  submitReview: Function,
  completeReviewForm: Function,
  clearReviewForm: Function,
  clearSubmitReviewStatus?: Function,
  saveReviewDraft: Function,
  currentUser: Object,
  uploadPhoto: Function,
  uploadedPhotos: Array<string>,
  isUploading: boolean,
  removePhoto: Function,
  step?: number,
};

class NewReviewFormContainer extends Component<Props> {
  componentWillUnmount() {
    const { clearSubmitReviewStatus } = this.props;
    if (clearSubmitReviewStatus) {
      clearSubmitReviewStatus();
    }
  }
  render() {
    const {
      category,
      isLoading,
      error,
      submitError,
      submitSuccess,
      data,
      review,
      reviewData,
      reviewDraft,
      reviewId,
      currentUser,
      uploadedPhotos,
      isUploading,
      step,
    } = this.props;

    const isLoadingReviewData = reviewData.get('isLoading');
    const reviewDataError = reviewData.get('error');
    const isLoadingReview = review.get('isLoading');

    if (
      (!isLoading && error !== '') ||
      (!isLoadingReviewData && reviewDataError !== '')
    ) {
      return <NotFound />;
    }
    return (
      <div>
        <Helmet title={data && data.get('name')} />
        {!data || (reviewId && isLoadingReviewData) ? (
          <Preloader />
        ) : (
          category === 'product' && (
            <NewProductReviewForm
              submitReview={this.props.submitReview}
              saveReviewDraft={this.props.saveReviewDraft}
              isLoading={isLoadingReview}
              reviewId={reviewId}
              reviewData={reviewData}
              reviewDraft={reviewDraft}
              currentUser={currentUser}
              data={data}
              productId={data && data.get('_id')}
              productType={data && data.get('__t')}
              errorMessage={submitError}
              successMessage={submitSuccess}
              completeReviewForm={this.props.completeReviewForm}
              clearReviewForm={this.props.clearReviewForm}
              uploadPhoto={this.props.uploadPhoto}
              uploadedPhotos={uploadedPhotos}
              isUploading={isUploading}
              removePhoto={this.props.removePhoto}
              step={step}
            />
          )
        )}
      </div>
    );
  }
}

export default NewReviewFormContainer;
