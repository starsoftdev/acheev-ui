// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { fromJS } from 'immutable';
import Breadcrumbs from 'components/Breadcrumbs';

import Review from 'components/Review';
import ProductReviewForm from 'components/ReviewForm/Product';
import BusinessReviewForm from 'components/ReviewForm/Business';
import CannabisProductReviewForm from 'components/CannabisProductReviewForm';

import Preloader from 'components/Preloader';
import NotFound from 'pages/NotFound';

import pluralizeCategory from 'utils/pluralizeCategory';

type Props = {
  category: string,
  isLoading: boolean,
  error: string,
  submitError: string,
  submitSuccess: string,
  data: Object,
  review: Object,
  reviewData: Object,
  reviewCompletion: Object,
  slug: string,
  reviewId: string,
  submitReview: Function,
  completeReviewForm: Function,
  clearReviewForm: Function,
  clearSubmitReviewStatus?: Function,
  currentUser: Object,
  uploadPhoto: Function,
  uploadedPhotos: Array<string>,
  isUploading: boolean,
  removePhoto: Function,
};

class ReviewFormContainer extends Component<Props> {
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
      reviewCompletion,
      slug,
      reviewId,
      currentUser,
      uploadedPhotos,
      isUploading,
    } = this.props;
    let categoryPlural = pluralizeCategory(category);
    if (category === 'product') {
      const productCategory =
        data && data.get('__t') ? data.get('__t').toLowerCase() : 'product';
      categoryPlural = pluralizeCategory(productCategory);
    }
    const isLoadingReviewData = reviewData.get('isLoading');
    const reviewDataError = reviewData.get('error');
    const isLoadingReview = review.get('isLoading');
    const reviewError = review.get('error');
    const title = reviewData.getIn(['data', 'title']);
    let breadcrumbPath = fromJS([
      {
        link: `/${categoryPlural}`,
        title: categoryPlural,
      },
      {
        link: `/${categoryPlural}/${slug}`,
        title: data && data.get('name'),
      },
      {
        link: `/${categoryPlural}/${slug}/reviews`,
        title: 'reviews',
      },
      {
        link: reviewId ? `/${categoryPlural}/${slug}/reviews/${reviewId}` : '',
        title: reviewId ? title : 'Create Review',
      },
    ]);
    if (reviewId) {
      breadcrumbPath = breadcrumbPath.push(
        fromJS({
          link: '',
          title: 'Edit',
        })
      );
    }

    if (
      (!isLoading && error !== '') ||
      (!isLoadingReviewData && reviewDataError !== '')
    ) {
      return <NotFound />;
    }

    let productReviewForm = null;
    if (categoryPlural === 'accessories') {
      productReviewForm = (
        <ProductReviewForm
          submitReview={this.props.submitReview}
          isLoading={isLoadingReview}
          reviewId={reviewId}
          reviewData={fromJS({})}
          currentUser={currentUser}
          productId={data && data.get('_id')}
          errorMessage={submitError}
          successMessage={submitSuccess}
          completeReviewForm={this.props.completeReviewForm}
          clearReviewForm={this.props.clearReviewForm}
        />
      );
    } else {
      productReviewForm = (
        <CannabisProductReviewForm
          submitReview={this.props.submitReview}
          isLoading={isLoadingReview}
          reviewId={reviewId}
          reviewData={fromJS({})}
          currentUser={currentUser}
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
        />
      );
    }
    return (
      <div>
        <Helmet title={data && data.get('name')} />
        <Breadcrumbs path={breadcrumbPath} />
        {!data || (reviewId && isLoadingReviewData) ? (
          <Preloader />
        ) : (
          <Review
            data={data}
            isLoading={isLoading}
            error={error}
            currentUser={currentUser}
            reviewCompletion={reviewCompletion}
          >
            {category === 'product' ? (
              productReviewForm
            ) : (
              <BusinessReviewForm
                category={category}
                slug={slug}
                submitReview={this.props.submitReview}
                isLoading={isLoadingReview}
                reviewId={reviewId}
                reviewData={reviewData}
                currentUser={currentUser}
                completeReviewForm={this.props.completeReviewForm}
                clearReviewForm={this.props.clearReviewForm}
                businessId={data.get('_id')}
                error={reviewError}
              />
            )}
          </Review>
        )}
      </div>
    );
  }
}

export default ReviewFormContainer;
