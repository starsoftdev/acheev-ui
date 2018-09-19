// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { history } from 'components/ConnectedRouter';
import { generate } from 'shortid';
import { push } from 'react-router-redux';
import qs from 'qs';
import { get } from 'utils/immutable';
import title from 'utils/title';

import ButtonGroup from 'components/ButtonGroup';
import Tab from 'components/RouterTab';
import BorderedTitle from 'components/BorderedTitle';
import Pagination from 'components/Pagination';
import ReviewList from 'components/ReviewList';
import ReviewSort from 'components/Sort';
import Select from 'components/Select';
import NoReviewBanner from 'components/NoReviewBanner';
import Helmet from 'components/Helmet';

import { setMetaJson } from 'containers/App/sagas';

import pluralizeCategory from 'utils/pluralizeCategory';

import {
  requestProductReviews,
  deleteReview,
  voteReview,
  setBreadcrumbPath,
  setReviewsFilters,
} from 'containers/Product/sagas';

import FILTER_OPTIONS from 'enum/filter/options';

type Props = {
  requestProductReviews: Function,
  deleteReview: Function,
  voteReview: Function,
  setMetaJson: Function,
  data: Object,
  isLoading: boolean,
  slug: string,
  reviewsData: Object,
  reviewsPages: number,
  reviewsPage: number,
  reviewsLoading: boolean,
  review: Object,
  reviewVote: Object,
  currentUser: Object,
  reviewsSortBy: string,
  setBreadcrumbPath: Function,
  setReviewsFilters: Function,
  push: Function,
  model: Map<string, Object>,
  location: Object,
};

class ProductReviewsPage extends Component<Props> {
  componentDidMount() {
    const { data } = this.props;

    this.props.setReviewsFilters(qs.parse(this.props.location.query));

    if (data) {
      this.props.requestProductReviews(data.get('_id'));
      this.setBreadcrumbPath(data);
    }
  }
  componentWillReceiveProps(oldProps: Props) {
    const {
      isLoading,
      data,
      review,
      reviewsLoading,
      reviewVote,
      reviewsSortBy,
      reviewsData,
      model,
    } = this.props;
    const {
      location: { pathname },
    } = this.props;
    let reviewMeta = [];
    const productId = get(data, '_id', null);
    const wasUpdatingReview = oldProps.review.get('isLoading');
    const isReviewUpdated =
      review.get('isLoading') === false && review.get('error') === '';
    const wasVotingReview = oldProps.reviewVote.get('isLoading');
    const isReviewVoted =
      reviewVote.get('isLoading') === false && reviewVote.get('error') === '';
    const wasLoadingProduct = oldProps.isLoading;
    const isProductLoaded = isLoading === false && !!data && !!data.get('_id');

    if (!model.equals(oldProps.model)) {
      this.props.push({
        pathname,
        search: `?${qs.stringify({
          page: model.get('page'),
          per_page: model.get('per_page'),
          sort: model.get('sortBy'),
        })}`,
      });
      return;
    }

    if (!reviewsLoading && wasLoadingProduct && isProductLoaded) {
      this.props.requestProductReviews(data.get('_id'));
      this.setBreadcrumbPath(data);
    }

    if (!reviewsLoading && oldProps.reviewsLoading) {
      reviewMeta = reviewsData.toJS().map(item => {
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

    if (reviewsSortBy !== oldProps.reviewsSortBy) {
      this.props.requestProductReviews(data.get('_id'));
    }

    if (data && wasUpdatingReview === true && isReviewUpdated === true) {
      this.props.requestProductReviews(productId, ['page'], 1);
    }

    if (data && wasVotingReview === true && isReviewVoted === true) {
      this.props.requestProductReviews(productId, ['page'], 1);
    }
  }

  setBreadcrumbPath = (data: Object) => {
    const { slug } = this.props;
    const category = pluralizeCategory(get(data, '__t'));
    const breadcrumbPath = fromJS([
      {
        link: `/${category}`,
        title: `${category}`,
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
    const { reviewsSortBy, data } = this.props;
    const productId = get(data, '_id', null);
    if (productId && sortBy !== reviewsSortBy) {
      this.props.requestProductReviews(productId, ['sortBy'], sortBy);
    }
  };

  render() {
    const {
      data,
      currentUser,
      reviewsData,
      reviewsPages,
      reviewsPage,
      reviewsLoading,
      slug,
      reviewsSortBy,
    } = this.props;
    const productId = data ? data.get('_id') : null;
    const totalReviews = data && data.get('reviews').size;
    const type = get(data, '__t');
    const category = type ? type.toLowerCase() : 'product';
    const baseUrl = `/${pluralizeCategory(category)}/${slug}`;
    const name = get(data, 'name');
    const tabOptions = ['About', 'Reviews'];
    if (category !== 'product') {
      tabOptions.push('Photos');
    }
    return (
      <div>
        <Helmet title={title({ name, type, postfix: 'Reviews' })} />
        <ButtonGroup className="centered mb-lg hide-for-small-only">
          <Tab to={baseUrl}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>Reviews</Tab>
          {category !== 'product' && <Tab to={`${baseUrl}/photos`}>Photos</Tab>}
        </ButtonGroup>
        <div className="row column mb-xl">
          <Select
            className="blackTheme mb-lg show-for-small-only b-primary"
            value="Reviews"
            onChange={e =>
              history.push(`${baseUrl}/${e.target.value.toLowerCase()}`)
            }
          >
            {tabOptions.map(item => (
              <option key={generate()} value={item}>
                {item}
              </option>
            ))}
          </Select>
          {totalReviews ? (
            <div>
              <div className="row">
                <BorderedTitle className="small-12 medium-expand column">
                  Reviews
                </BorderedTitle>
                <Pagination
                  onlyPaginator
                  forcePage={reviewsPage}
                  pageCount={reviewsPages}
                  onPageChange={e =>
                    this.props.requestProductReviews(productId, ['page'], e)
                  }
                />
              </div>

              <ReviewSort
                options={FILTER_OPTIONS.REVIEW_SORT_OPTIONS}
                value={reviewsSortBy}
                sort={this.sortReviews}
              />
            </div>
          ) : (
            <div>
              <BorderedTitle>No reviews yet</BorderedTitle>
            </div>
          )}
          <section>
            <ReviewList
              data={reviewsData}
              category={category}
              slug={slug}
              isLoading={reviewsLoading}
              currentUser={currentUser}
              deleteReview={this.props.deleteReview}
              voteReview={this.props.voteReview}
              review={fromJS({})}
            />
          </section>
          <Pagination
            forcePage={reviewsPage}
            pageCount={reviewsPages}
            onPageChange={e =>
              this.props.requestProductReviews(productId, ['page'], e)
            }
          />
        </div>
        {totalReviews < 5 && <NoReviewBanner to={`${baseUrl}/create-review`} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  data: state.getIn(['product', 'data', 'hits', 0]),
  isLoading: state.getIn(['product', 'isLoading']),
  slug: state.getIn(['product', 'slug']),
  reviewsData: state.getIn(['product', 'reviews', 'data', 'hits']),
  reviewsPages: state.getIn(['product', 'reviews', 'data', 'pages']),
  reviewsPage: state.getIn(['product', 'reviews', 'model', 'page']),
  reviewsLoading: state.getIn(['product', 'reviews', 'isLoading']),
  reviewsSortBy: state.getIn(['product', 'reviews', 'model', 'sortBy']),
  review: state.getIn(['product', 'review']),
  reviewVote: state.getIn(['product', 'reviewVote']),
  cart: state.getIn(['app', 'cart']),
  model: state.getIn(['product', 'reviews', 'model']),
});

const mapDispatchToProps = dispatch => ({
  requestProductReviews: (id, path, value) =>
    dispatch(requestProductReviews(id, path, value)),
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
)(ProductReviewsPage);
