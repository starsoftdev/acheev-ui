// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { List } from 'immutable';

import injectSagas from 'utils/injectSagas';

import ProductReviewContainer from 'containers/ProductReview';
import Breadcrumbs from 'components/Breadcrumbs';
import Review from 'components/Review';
import Preloader from 'components/Preloader';

import saga, { reducer, requestProduct } from 'containers/Product/sagas';

type Props = {
  match: Object,
  product: Object,
  requestProduct: Function,
  currentUser: Object,
  breadcrumbPath: List<Map<string, Object>>,
  helmetTitle: string,
  reviewCompletion: Object,
};

class ProductReviewPage extends Component<Props> {
  componentDidMount() {
    const {
      match: { params },
      product,
    } = this.props;
    if (!product) {
      this.props.requestProduct(params.slug);
    }
  }
  render() {
    const {
      match: { params },
      product,
      currentUser,
      breadcrumbPath,
      helmetTitle,
      reviewCompletion,
    } = this.props;

    if (!product) return <Preloader />;
    return (
      <div>
        <Helmet title={helmetTitle} />
        <Breadcrumbs path={breadcrumbPath} />
        <Review
          data={product}
          currentUser={currentUser}
          reviewCompletion={reviewCompletion}
        >
          <ProductReviewContainer reviewId={params.id} slug={params.slug} />
        </Review>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  product: state.getIn(['product', 'data', 'hits', 0]),
  isLoading: state.getIn(['product', 'isLoading']),
  error: state.getIn(['product', 'error']),
  breadcrumbPath: state.getIn(['product', 'breadcrumbPath']),
  helmetTitle: state.getIn(['product', 'helmetTitle']),
  review: state.getIn(['product', 'review']),
  reviewData: state.getIn(['product', 'reviewData']),
  reviewCompletion: state.getIn(['product', 'reviewCompletion']),
});

const mapDispatchToProps = dispatch => ({
  requestProduct: slug => dispatch(requestProduct(slug)),
});

export default compose(
  injectSagas({ key: 'product', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProductReviewPage);
