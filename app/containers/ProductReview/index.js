// @flow

import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';

import ReviewItem from 'components/ReviewList/ReviewItem';
import CannabisProductReviewItem from 'components/ReviewList/CannabisProductReviewItem';

import {
  requestReview,
  deleteReview,
  voteReview,
  setBreadcrumbPath,
  setHelmetTitle,
} from 'containers/Product/sagas';

import { requestUser, setMetaJson } from 'containers/App/sagas';

type Props = {
  reviewId: string,
  slug: string,
  product: Object,
  isLoading: boolean,
  reviewVote: Object,
  reviewData: Object,
  currentUser: Object,
  requestReview: Function,
  deleteReview: Function,
  voteReview: Function,
  setBreadcrumbPath: Function,
  setHelmetTitle: Function,
  requestUser: Function,
  setMetaJson: Function,
};

class ProductReviewContainer extends Component<Props> {
  componentWillMount() {
    const { reviewId, product, reviewData, currentUser } = this.props;
    if (currentUser) {
      this.props.requestUser();
    }
    if (product && reviewId) {
      if (
        !reviewData.get('data').get('id') ||
        reviewData.get('data').get('id') !== reviewId
      ) {
        this.props.requestReview(reviewId);
      } else {
        const reviewAuthor = reviewData.getIn(['data', 'user', 'username']);
        this.props.setHelmetTitle(
          `${reviewAuthor || ''} Review for ${product.getIn([
            'name',
          ])} - Lift & Co.`
        );
        this.setBreadcrumbPath(reviewData);
      }
    }
  }
  componentWillReceiveProps(newProps: Object) {
    const { reviewId, product, isLoading, reviewVote, reviewData } = this.props;

    const wasLoadingProduct = this.props.isLoading;
    const isProductLoaded =
      isLoading === false && !!product && !!product.get('id');
    if (wasLoadingProduct && isProductLoaded) {
      this.props.requestReview(reviewId);
    }

    const wasReviewDataLoading = reviewData.get('isLoading');
    const isReviewDataLoaded =
      newProps.reviewData.get('isLoading') === false &&
      newProps.reviewData.get('error') === '';

    let reviewMetaJson = {};

    if (product && wasReviewDataLoading && isReviewDataLoaded) {
      const reviewAuthor = newProps.reviewData.getIn([
        'data',
        'user',
        'username',
      ]);
      this.props.setHelmetTitle(
        `${reviewAuthor || ''} Review for ${newProps.product.getIn([
          'name',
        ])} - Lift & Co.`
      );
      this.setBreadcrumbPath(newProps.reviewData);

      let author = '';
      if (
        newProps.reviewData.getIn(['data', 'user']) &&
        newProps.reviewData.getIn(['data', 'user', 'fullName'])
      ) {
        author = newProps.reviewData.getIn(['data', 'user', 'fullName']);
      } else if (newProps.reviewData.getIn(['data', 'user'])) {
        author = newProps.reviewData.getIn(['data', 'user', 'username']);
      } else {
        author = newProps.reviewData.getIn(['data', 'guest', 'name']);
      }
      reviewMetaJson = {
        '@type': 'Review',
        author,
        datePublished: newProps.reviewData.getIn(['data', 'createdOn']),
        reviewBody: newProps.reviewData.getIn(['data', 'message']),
        name: newProps.reviewData.getIn(['data', 'title']),
        reviewRating: {
          '@type': 'Rating',
          bestRating: 5,
          ratingValue: newProps.reviewData.getIn(['data', 'rating']),
          worstRating: 0,
        },
        itemReviewed: {
          '@type': 'Product',
          category: product.get('category'),
          productID: product.get('slug'),
          description: product.get('description'),
          name: product.get('name'),
          brand: {
            '@type': 'Organization',
            name: product.getIn(['business', 'name']),
            email: product.getIn(['business', 'email']),
            faxNumber: product.getIn(['business', 'fax']),
            logo: product.getIn(['business', 'thumbnail']),
            description: product.getIn(['business', 'description']),
            telephone: product.getIn(['business', 'telephone']),
            url: product.getIn(['business', 'website']),
            address: {
              '@type': 'PostalAddress',
              addressLocality: product.getIn([
                'business',
                'locations',
                0,
                'city',
              ]),
              addressRegion: product.getIn([
                'business',
                'locations',
                0,
                'province',
              ]),
              postalCode: product.getIn([
                'business',
                'locations',
                0,
                'postalCode',
              ]),
              streetAddress: product.getIn([
                'business',
                'locations',
                0,
                'address',
              ]),
            },
          },
        },
      };
      this.props.setMetaJson(['mainEntity'], reviewMetaJson);
    }

    const wasVotingReview = reviewVote && reviewVote.get('isLoading');
    const isVoteUpdated =
      reviewVote &&
      newProps.reviewVote.get('isLoading') === false &&
      newProps.reviewVote.get('error') === '';

    if (product && wasVotingReview && isVoteUpdated) {
      this.props.requestReview(reviewId);
    }
  }
  setBreadcrumbPath = (reviewData: Object) => {
    const { reviewId, slug, product } = this.props;
    let title = reviewData.getIn(['data', 'title']);
    if (!title) {
      title = reviewId;
    }
    const productCategory =
      product && product.get('__t')
        ? product.get('__t').toLowerCase()
        : 'accessorie';
    const breadcrumbPath = [
      {
        link: `/${productCategory}s`,
        title: `${productCategory}s`,
      },
      {
        link: `/${productCategory}s/${slug}`,
        title: product && product.get('name'),
      },
      {
        link: `/${productCategory}s/${slug}/reviews`,
        title: 'reviews',
      },
    ];

    breadcrumbPath.push({
      link: '',
      title,
    });

    this.props.setBreadcrumbPath(fromJS(breadcrumbPath));
  };
  render() {
    const { slug, product, reviewData, currentUser } = this.props;
    const productCategory =
      product && product.get('__t')
        ? product.get('__t').toLowerCase()
        : 'product';

    return (
      <div>
        {productCategory === 'product' && reviewData.get('data').size ? (
          <ReviewItem
            category={productCategory}
            slug={slug}
            data={reviewData.get('data')}
            currentUser={currentUser}
            voteReview={this.props.voteReview}
            deleteReview={this.props.deleteReview}
          />
        ) : (
          <CannabisProductReviewItem
            category={productCategory}
            slug={slug}
            data={reviewData.get('data')}
            currentUser={currentUser}
            voteReview={this.props.voteReview}
            deleteReview={this.props.deleteReview}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  product: state.getIn(['product', 'data', 'hits', 0]),
  isLoading: state.getIn(['product', 'isLoading']),
  reviewVote: state.getIn(['product', 'reviewVote']),
  reviewData: state.getIn(['product', 'reviewData']),
  currentUser: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  requestReview: id => dispatch(requestReview(id)),
  voteReview: (reviewId, type) => dispatch(voteReview(reviewId, type)),
  deleteReview: reviewId => dispatch(deleteReview(reviewId)),
  setBreadcrumbPath: path => dispatch(setBreadcrumbPath(path)),
  setHelmetTitle: title => dispatch(setHelmetTitle(title)),
  requestUser: () => dispatch(requestUser()),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ProductReviewContainer
);
