// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Link from 'components/Link';
import { List, fromJS } from 'immutable';
import injectSagas from 'utils/injectSagas';

import Pagination from 'components/Pagination';
import ReviewStatusList from 'components/ReviewStatusList';
import Button from 'components/Button';
import Preloader from 'components/Preloader';
import CustomSelect from 'components/CustomSelect';

import FILTER_OPTIONS from 'enum/filter/options';
import { setProfileBreadcrumbPath } from 'containers/App/sagas';
import saga, { reducer, requestReviews, sortReview } from './sagas';

import NoReviews from './no-reviews.png';
import './styles.scss';

type Props = {
  user: Object,
  isLoading: boolean,
  reviews: List<*>,
  reviewsSortBy: string,
  reviewsPages: number,
  requestReviews: Function,
  sortReview: Function,
  setProfileBreadcrumbPath: Function,
};

class MyReviews extends Component<Props> {
  componentWillMount() {
    const breadcrumbPath = fromJS([
      {
        link: '/me',
        title: 'My Account',
      },
      {
        link: '',
        title: 'My Reviews',
      },
    ]);
    this.props.setProfileBreadcrumbPath(breadcrumbPath);
  }
  componentDidMount() {
    this.props.requestReviews(this.props.user.get('_id'));
  }
  render() {
    const {
      reviews,
      isLoading,
      reviewsSortBy,
      reviewsPages,
      user,
    } = this.props;
    return (
      <div className="myReviews">
        {isLoading ? (
          <Preloader height={534} />
        ) : (
          <div>
            <div className="myReviews__filter row">
              <div className="column small-12 medium-8">
                <div className="row align-middle mb-sm">
                  <div className="columns small-12 npr mb-sm">
                    <h2 className="c-secondary">
                      Check the status of your reviews
                    </h2>
                  </div>
                </div>
              </div>
              <div className="column small-12 medium-4">
                <div className="row align-middle mb-sm">
                  <div className="columns shrink npr mb-sm">
                    <label htmlFor="type">Sort By:</label>
                  </div>
                  <div className="columns mb-sm">
                    <CustomSelect
                      name="sort"
                      className="large"
                      options={FILTER_OPTIONS.REVIEW_SORT_OPTIONS}
                      value={reviewsSortBy}
                      clearable={false}
                      onChange={e => {
                        this.props.sortReview(e.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {reviews.size === 0 ? (
              <div className="myReviews__noReviews row column">
                <img className="mb-lg" src={NoReviews} alt="no reviews" />
                <h2 className="mb-xl c-secondary">
                  No reviews yet. To get started click below.
                </h2>
                <Button
                  to="/create-review"
                  element={Link}
                  className="secondary"
                >
                  Create a Review
                </Button>
              </div>
            ) : (
              <div className="row column">
                <ReviewStatusList data={reviews} isLoading={isLoading} />
              </div>
            )}
          </div>
        )}
        <Pagination
          pageCount={reviewsPages}
          onPageChange={e =>
            this.props.requestReviews(user.get('_id'), ['page'], e)
          }
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['myreviews', 'isLoading']),
  reviews: state.getIn(['myreviews', 'data', 'hits']),
  reviewsPages: state.getIn(['myreviews', 'data', 'pages']),
  reviewsSortBy: state.getIn(['myreviews', 'filter', 'model', 'sortBy']),
});

const mapDispatchToProps = dispatch => ({
  requestReviews: (userId, path, value) =>
    dispatch(requestReviews(userId, path, value)),
  sortReview: sortBy => dispatch(sortReview(sortBy)),
  setProfileBreadcrumbPath: path => dispatch(setProfileBreadcrumbPath(path)),
});

export default compose(
  injectSagas({ key: 'myreviews', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MyReviews);
