// @flow

import React, { Component } from 'react';
import { fromJS, List } from 'immutable';
import { connect } from 'react-redux';
import { compose } from 'redux';

import injectSagas from 'utils/injectSagas';

import Breadcrumbs from 'components/Breadcrumbs';
import PageBanner from 'components/PageBanner';
import CreateReview from 'components/CreateReview';

import saga, { reducer, requestProducts } from 'pages/CreateReview/sagas';

type Props = {
  products: List<Map<string, Object>>,
  isLoading: boolean,
  error: Object,
  pages: number,
  requestProducts: Function,
  trackPageStep2: Function,
};

class CreateReviewPage extends Component<Props> {
  render() {
    const { products, isLoading, error, pages } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Create a review',
      },
    ]);
    return (
      <div className="createReviewPage">
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          expanded
          responsiveBg
          title="Create a review"
          titleLarge
          subtitle="Select a strain to get started with leaving a review."
        />
        <CreateReview
          requestProducts={this.props.requestProducts}
          trackPageStep2={this.props.trackPageStep2}
          products={products}
          isLoading={isLoading}
          error={error}
          pages={pages}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  products: state.getIn(['createReview', 'data', 'hits']),
  isLoading: state.getIn(['createReview', 'isLoading']),
  error: state.getIn(['createReview', 'error']),
  pages: state.getIn(['createReview', 'data', 'pages']),
});

const mapDispatchToProps = dispatch => ({
  requestProducts: (path, keyword) => dispatch(requestProducts(path, keyword)),
});

export default compose(
  injectSagas({ key: 'createReview', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CreateReviewPage);
