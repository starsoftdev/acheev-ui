// @flow

import React, { Component } from 'react';
import { fromJS, List } from 'immutable';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { history } from 'components/ConnectedRouter';

import injectSagas from 'utils/injectSagas';

import Breadcrumbs from 'components/Breadcrumbs';
import PageBanner from 'components/PageBanner';
import CreateReview from 'components/CreateReview';

import saga, { reducer, requestProducts } from 'pages/CreateReview/sagas';

type Props = {
  currentUser: Object,
  products: List<Map<string, Object>>,
  isLoading: boolean,
  error: Object,
  pages: number,
  requestProducts: Function,
};

class GoPage extends Component<Props> {
  componentDidMount() {
    const { currentUser } = this.props;
    if (!currentUser) {
      history.push('/go/register');
    } else {
      history.push('/create-review');
    }
  }
  render() {
    const { products, isLoading, error, pages } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Go',
      },
    ]);
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          responsiveBg
          title="Write a review"
          subtitle="Find your product to leave your review."
        />
        <CreateReview
          requestProducts={this.props.requestProducts}
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
  currentUser: state.getIn(['app', 'user']),
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
)(GoPage);
