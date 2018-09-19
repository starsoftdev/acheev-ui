// @flow

import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { List } from 'immutable';

import Link from 'components/Link';
import Preloader from 'components/Preloader';
import ProductReviewForm from 'containers/ReviewForm';
import NewProductReviewForm from 'containers/NewReviewForm';

import injectSagas from 'utils/injectSagas';

import saga, {
  reducer,
  requestProduct,
  submitReview,
  requestReview,
  completeReviewForm,
  clearReviewForm,
  saveReviewDraft,
  clearSubmitReviewStatus,
  requestReviewPhotoUpload,
  removePhoto,
} from 'containers/Product/sagas';

type Props = {
  isLoading: boolean,
  error: string,
  submitError: string,
  submitSuccess: string,
  product: Object,
  review: Object,
  reviewData: Object,
  reviewDraft: Object,
  requestProduct: Function,
  submitReview: Function,
  requestReview: Function,
  saveReviewDraft: Function,
  currentUser: Object,
  reviewCompletion: Object,
  completeReviewForm: Function,
  clearReviewForm: Function,
  clearSubmitReviewStatus: Function,
  uploadPhoto: Function,
  uploadedPhotos: List<Map>,
  isUploading: boolean,
  removePhoto: Function,
  match: Object,
  formType?: string,
  location: Object,
};

class ProductReviewFormPage extends Component<Props> {
  componentDidMount() {
    const {
      match: { params },
      product,
    } = this.props;
    if (!product || product.get('slug') !== params.slug) {
      this.props.requestProduct(params.slug);
    }
    if (params.id) {
      this.props.requestReview(params.id);
    }
  }
  render() {
    const {
      isLoading,
      error,
      submitError,
      submitSuccess,
      product,
      review,
      reviewData,
      currentUser,
      reviewDraft,
      reviewCompletion,
      isUploading,
      uploadedPhotos,
      match: { params },
      location: { pathname },
      formType,
    } = this.props;
    const {
      params: { productType },
    } = matchPath(pathname, {
      path: '/:productType/:slug',
    });
    const step = parseInt(params.step || 1, 10);
    if (isLoading) {
      return <Preloader />;
    }

    if (!product) {
      return (
        <div className="row column text-center">
          <h3 className="pt-xl pb-xl">
            This product does not exist. Please explore our {productType}{' '}
            <Link className="plain-link" to={`/${productType}`}>
              here
            </Link>
            .
          </h3>
        </div>
      );
    }
    return formType === 'new' ? (
      <NewProductReviewForm
        category="product"
        slug={params.slug}
        step={step}
        reviewId={params.id}
        data={product}
        isLoading={isLoading}
        error={error}
        submitError={submitError}
        saveReviewDraft={this.props.saveReviewDraft}
        submitSuccess={submitSuccess}
        review={review}
        reviewData={reviewData}
        reviewDraft={reviewDraft}
        submitReview={this.props.submitReview}
        completeReviewForm={this.props.completeReviewForm}
        clearReviewForm={this.props.clearReviewForm}
        clearSubmitReviewStatus={this.props.clearSubmitReviewStatus}
        currentUser={currentUser}
        uploadPhoto={this.props.uploadPhoto}
        isUploading={isUploading}
        uploadedPhotos={uploadedPhotos}
        removePhoto={this.props.removePhoto}
      />
    ) : (
      <ProductReviewForm
        category="product"
        slug={params.slug}
        reviewId={params.id}
        data={product}
        isLoading={isLoading}
        error={error}
        submitError={submitError}
        submitSuccess={submitSuccess}
        review={review}
        reviewData={reviewData}
        reviewCompletion={reviewCompletion}
        submitReview={this.props.submitReview}
        completeReviewForm={this.props.completeReviewForm}
        clearReviewForm={this.props.clearReviewForm}
        clearSubmitReviewStatus={this.props.clearSubmitReviewStatus}
        currentUser={currentUser}
        uploadPhoto={this.props.uploadPhoto}
        isUploading={isUploading}
        uploadedPhotos={uploadedPhotos}
        removePhoto={this.props.removePhoto}
      />
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  product: state.getIn(['product', 'data', 'hits', 0]),
  isLoading: state.getIn(['product', 'isLoading']),
  error: state.getIn(['product', 'error']),
  submitError: state.getIn(['product', 'review', 'errorMessage']),
  submitSuccess: state.getIn(['product', 'review', 'successMessage']),
  review: state.getIn(['product', 'review']),
  reviewData: state.getIn(['product', 'reviewData']),
  reviewDraft: state.getIn(['product', 'reviewDraft']),
  reviewCompletion: state.getIn(['product', 'reviewCompletion']),
  uploadedPhotos: state.getIn(['product', 'uploadedPhotos']),
  isUploading: state.getIn(['product', 'isUploading']),
});

const mapDispatchToProps = dispatch => ({
  requestProduct: slug => dispatch(requestProduct(slug)),
  submitReview: (payload, reviewId) =>
    dispatch(submitReview(payload, reviewId)),
  saveReviewDraft: payload => dispatch(saveReviewDraft(payload)),
  requestReview: id => dispatch(requestReview(id)),
  completeReviewForm: (path, value) =>
    dispatch(completeReviewForm(path, value)),
  clearReviewForm: () => dispatch(clearReviewForm()),
  clearSubmitReviewStatus: () => dispatch(clearSubmitReviewStatus()),
  uploadPhoto: (index, payload) =>
    dispatch(requestReviewPhotoUpload(index, payload)),
  removePhoto: index => dispatch(removePhoto(index)),
});

export default compose(
  injectSagas({ key: 'product', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProductReviewFormPage);
