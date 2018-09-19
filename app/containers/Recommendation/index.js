// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';
import { List } from 'immutable';
import cx from 'classnames';
import parseSearch from 'utils/parseSearch';

import Preloader from 'components/Preloader';
import ProductList from 'components/ProductsListAlt';
import Pagination from 'components/Pagination';
import Link from 'components/Link';

import { requestRecoProducts, requestFullProducts } from './sagas';

type Props = {
  match: { url: string },
  location: { search: string },
  category: string,
  recommends: Map<string, Object>,
  isMinimized?: boolean,
  requestRecoProducts: Function,
  requestFullProducts: Function,
};

class RecommendProductList extends Component<Props> {
  componentDidMount() {
    const { category } = this.props;
    const query = parseSearch(this.props.location.search);

    this.props.requestRecoProducts(category, query);
  }

  onPageChange(page) {
    const { category } = this.props;
    this.props.requestFullProducts(category, page);
  }

  render() {
    const {
      match: { url },
      location: { search: query },
      category,
      recommends,
      isMinimized,
    } = this.props;
    const productIds: List<Object> = recommends.getIn(
      ['data', 'hits'],
      new List()
    );
    const products = recommends.get('products');
    const isLoading = recommends.get('isLoading');
    return isLoading ? (
      <Preloader />
    ) : (
      <div className="row small-12 align-center mb-xl">
        {products.get('isLoading') ? (
          <Preloader />
        ) : (
          <ProductList
            data={
              isMinimized
                ? products.get('hits').slice(0, 4)
                : products.get('hits')
            }
            className={cx(
              { [`recommendProductPage__${category}Bg`]: isMinimized },
              'mb-xl'
            )}
          />
        )}
        <div className="row small-12 align-center">
          {isMinimized && (
            <Link className="button coral" to={`${url}/${category}${query}`}>
              View all recommended {category}s
            </Link>
          )}
          {!isMinimized &&
            !!productIds.size && (
              <Pagination
                forcePage={1}
                pageCount={productIds.size}
                onlyPaginator
                altTheme
                onPageChange={page => this.onPageChange(page)}
              />
            )}
        </div>
      </div>
    );
  }
}

const mapStateToPtops = (state, props) => ({
  recommends: state.getIn(['recommend', props.category]),
});
const mapDispatchToProps = dispatch => ({
  requestRecoProducts: (category, query) =>
    dispatch(requestRecoProducts(category, query)),
  requestFullProducts: (category, page) =>
    dispatch(requestFullProducts(category, page)),
});
export default connect(
  mapStateToPtops,
  mapDispatchToProps
)(RecommendProductList);
