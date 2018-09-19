// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fromJS } from 'immutable';
import type { List, Map } from 'immutable';
import { push, replace } from 'react-router-redux';
import qs from 'qs';

import injectSagas from 'utils/injectSagas';
import isMobile from 'utils/checkMobile';

import Breadcrumbs from 'components/Breadcrumbs';
import Filter from 'components/Filter';
import ProductsList from 'components/ProductsList';
import Preloader from 'components/Preloader';
import saga, {
  reducer,
  requestFilters,
  requestProducts,
  resetQuery,
  setFilters,
  setQuery,
} from 'containers/Search/sagas';
import ProductFilter from 'components/Filter/ProductFilter';
import ProductShowFilter from 'components/Filter/ProductShowFilter';
import InfiniteScroll from 'components/InfiniteScroll';

import compareDeep from 'utils/compareDeepByVal';

type Props = {
  category: string,
  slug: string,
  products: List<Map<string, Object>>,
  model: Map<string, Object>,
  query: Map<string, Object>,
  filter: Object,
  isLoading: boolean,
  requestFilters: Function,
  requestProducts: Function,
  resetQuery: Function,
  setQuery: Function,
  pages: number,
  page: number,
  push: Function,
  replace: Function,
  setFilters: Function,
  location: Object,
};

class SearchContainer extends Component<Props> {
  componentDidMount() {
    const { category, page } = this.props;
    if (!this.props.filter.get('data')) this.props.requestFilters(category);
    this.props.setFilters(category, qs.parse(this.props.location.query));
    this.props.requestProducts(category, ['page'], page);
  }

  componentDidUpdate(prevProps: Props) {
    const {
      location: { pathname },
      model,
      query,
      category,
      page,
    } = this.props;
    const shouldUpdateQuery =
      pathname === this.props.location.pathname &&
      this.props.location.search === '';
    const search = `?${qs.stringify({
      ...model.toJS(),
      query: query.toJS(),
    })}`;
    if (shouldUpdateQuery) {
      this.props.replace(`${pathname}${search}`);
    } else if (
      !compareDeep(prevProps.model.toJS(), model.toJS()) ||
      !compareDeep(prevProps.query.toJS(), query.toJS())
    ) {
      this.props.push({
        pathname,
        search,
      });
    }

    if (prevProps.category !== category) {
      this.props.requestProducts(category, ['page'], page);
      this.props.requestFilters(category);
    }
  }

  onLoadMore = () => {
    const { page, category } = this.props;
    this.props.requestProducts(category, ['page'], page + 1);
  };

  render() {
    const {
      category,
      slug,
      products,
      isLoading,
      pages,
      page,
      filter,
    } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: `${slug}`,
      },
    ]);
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <div className="row column hide-for-small-only">
          <h1 className="c-darkest-gray mb-lg t-capitalize">
            {slug || category}
          </h1>
        </div>
        <Filter
          isBanner
          category={category}
          data={this.props.filter}
          requestItems={(path, value) =>
            this.props.requestProducts(category, path, value)
          }
          filter={filter}
        />
        <div className="row">
          {!isMobile() && (
            <div className="column small-12 medium-4 large-3">
              {filter && filter.get('data') ? (
                <ProductFilter
                  category={category}
                  options={filter.get('data')}
                  filter={filter}
                  resetQuery={() => this.props.resetQuery(category)}
                  requestProducts={(path, value) =>
                    this.props.requestProducts(category, path, value)
                  }
                  setQuery={value => this.props.setQuery(category, value)}
                />
              ) : (
                <Preloader />
              )}
            </div>
          )}
          <div className="column small-12 medium-8 large-9">
            <ProductShowFilter
              category={category}
              data={filter.get('data')}
              filter={filter}
              requestProducts={(path, value) =>
                this.props.requestProducts(category, path, value)
              }
            />
            <div className="text-center">
              {products && products.size === 0 ? (
                <div className="mb-xl">
                  Sorry! No products were found. Try changing your query or{' '}
                  <a
                    className="c-secondary"
                    onClick={() => this.props.resetQuery(category)}
                    role="button"
                  >
                    resetting your search
                  </a>
                </div>
              ) : (
                <ProductsList data={products} itemClassName="large-4" />
              )}
            </div>
          </div>
        </div>
        <InfiniteScroll
          className="mb-xl"
          isLoading={isLoading}
          page={page}
          pageCount={Math.ceil(pages)}
          loadMore={this.onLoadMore}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  products: state.getIn(['search', props.category, 'data', 'hits']),
  pages: state.getIn(['search', props.category, 'data', 'pages']),
  page: state.getIn(['search', props.category, 'filter', 'page']),
  isLoading: state.getIn(['search', props.category, 'isLoading']),
  filter: state.getIn(['search', props.category, 'filter']),
  model: state.getIn(['search', props.category, 'filter', 'model']),
  query: state.getIn(['search', props.category, 'filter', 'query']),
});

const mapDispatchToProps = dispatch => ({
  requestFilters: category => dispatch(requestFilters(category)),
  requestProducts: (category, path, value) =>
    dispatch(requestProducts(category, path, value)),
  resetQuery: category => dispatch(resetQuery(category)),
  setFilters: (category, parsedSearch) =>
    dispatch(setFilters(category, parsedSearch)),
  setQuery: (category, value) => dispatch(setQuery(category, value)),
  push: query => dispatch(push(query)),
  replace: path => dispatch(replace(path)),
});

export default compose(
  injectSagas({ key: 'search', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SearchContainer);
