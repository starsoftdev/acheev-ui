// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { fromJS } from 'immutable';
import Breadcrumbs from 'components/Breadcrumbs';
import { history } from 'components/ConnectedRouter';

import Review from 'components/Review';
import ReviewItem from 'components/ReviewList/ReviewItem';

import Preloader from 'components/Preloader';
import NotFound from 'pages/NotFound';

import pluralizeCategory from 'utils/pluralizeCategory';

type Props = {
  category: string,
  isLoading: boolean,
  error: string,
  data: Object,
  review: Object,
  reviewData: Object,
  reviewCompletion: Object,
  slug: string,
  reviewId: string,
  requestData: Function,
  requestReview: Function,
  deleteReview: Function,
  voteReview: Function,
  currentUser: Object,
  completeReviewForm: Function,
  clearReviewForm: Function,
  requestUser: Function,
  setMetaJson: Function,
};

class ReviewContainer extends Component<Props> {
  componentWillMount() {
    const { slug, reviewId, currentUser } = this.props;
    if (currentUser) {
      this.props.requestUser();
    }
    this.props.requestData(slug);
    if (reviewId) {
      this.props.requestReview(reviewId);
    }
  }

  componentWillReceiveProps(newProps: Object) {
    const { data, review, slug, category } = this.props;
    const { reviewData } = newProps;
    const wasUpdatingReview = review.get('isLoading');
    const isReviewUpdated =
      newProps.review.get('isLoading') === false &&
      newProps.review.get('error') === '';

    let reviewMetaJson = {};

    if (reviewData.get('data').size > 0 && newProps.data.size > 0) {
      this.props.completeReviewForm(['rating'], true);
      this.props.completeReviewForm(['title'], true);
      this.props.completeReviewForm(['message'], true);

      let author = '';
      if (
        reviewData.getIn(['data', 'user']) &&
        reviewData.getIn(['data', 'user', 'fullName'])
      ) {
        author = reviewData.getIn(['data', 'user', 'fullName']);
      } else if (reviewData.getIn(['data', 'user'])) {
        author = reviewData.getIn(['data', 'user', 'username']);
      } else {
        author = reviewData.getIn(['data', 'guest', 'name']);
      }
      reviewMetaJson = {
        '@type': 'Review',
        author,
        datePublished: reviewData.getIn(['data', 'createdOn']),
        reviewBody: reviewData.getIn(['data', 'message']),
        name: reviewData.getIn(['data', 'title']),
        reviewRating: {
          '@type': 'Rating',
          bestRating: 5,
          ratingValue: reviewData.getIn(['data', 'rating']),
          worstRating: 0,
        },
        itemReviewed: {
          '@type': 'Organization',
          name: newProps.data.get('name'),
          email: newProps.data.get('email'),
          faxNumber: newProps.data.get('fax'),
          logo: newProps.data.get('thumbnail'),
          description: newProps.data.get('description'),
          telephone: newProps.data.get('telephone'),
          url: newProps.data.get('website'),
          address: {
            '@type': 'PostalAddress',
            addressLocality: newProps.data.getIn(['locations', 0, 'city']),
            addressRegion: newProps.data.getIn(['locations', 0, 'province']),
            postalCode: newProps.data.getIn(['locations', 0, 'postalCode']),
            streetAddress: newProps.data.getIn(['locations', 0, 'address']),
          },
        },
      };
      this.props.setMetaJson(['mainEntity'], reviewMetaJson);
    }

    if (data && wasUpdatingReview && isReviewUpdated) {
      const categoryPlural =
        category === 'dispensary' ? 'dispensaries' : `${category}s`;
      history.push(`/${categoryPlural}/${slug}/reviews`);
    }
  }
  componentWillUnmount() {
    this.props.clearReviewForm();
  }
  render() {
    const {
      category,
      isLoading,
      error,
      data,
      reviewData,
      slug,
      reviewId,
      currentUser,
      reviewCompletion,
    } = this.props;
    const categoryPlural = pluralizeCategory(category);
    const isLoadingReviewData = reviewData.get('isLoading');
    const reviewDataError = reviewData.get('error');
    let title = reviewData.getIn(['data', 'title']);
    if (!title) {
      title = reviewId;
    }
    const breadcrumbPath = fromJS([
      {
        link: '/businesses',
        title: 'Businesses',
      },
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
        link: '',
        title: reviewId ? title : 'Create Review',
      },
    ]);
    let helmetTitle = 'Lift';
    if (data && reviewData && data.get('name') && reviewData.get('data')) {
      const reviewAuthor = reviewData.getIn(['data', 'user', 'username']);
      helmetTitle = `${reviewAuthor || ''} Review for ${data.get(
        'name'
      )} - Lift & Co.`;
    }

    if (
      (!isLoading && error !== '') ||
      (!isLoadingReviewData && reviewDataError !== '')
    ) {
      return <NotFound />;
    }
    return (
      <div>
        <Helmet title={helmetTitle} />
        <Breadcrumbs path={breadcrumbPath} />
        {!data || (reviewId && isLoadingReviewData) ? (
          <Preloader />
        ) : (
          <Review
            data={data}
            currentUser={currentUser}
            reviewCompletion={reviewCompletion}
          >
            {reviewData.get('data').size && (
              <ReviewItem
                category={category}
                slug={slug}
                data={reviewData.get('data')}
                currentUser={currentUser}
                voteReview={this.props.voteReview}
                deleteReview={this.props.deleteReview}
              />
            )}
          </Review>
        )}
      </div>
    );
  }
}

export default ReviewContainer;
