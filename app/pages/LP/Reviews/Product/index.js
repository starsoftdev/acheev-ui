// @flow

import React, { Component } from 'react';
import type Moment from 'moment';
import type { Map } from 'immutable';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fromJS } from 'immutable';
import { push } from 'react-router-redux';
import qs from 'qs';
import { omit } from 'lodash-es';
import injectSagas from 'utils/injectSagas';

import Preloader from 'components/Preloader';
import ProductFilter from 'components/Filter/ProductFilter';
import ReviewList from 'components/ReviewList';
import Pagination from 'components/Pagination';
import CustomSelect from 'components/CustomSelect';
import pluralizeCategory from 'utils/pluralizeCategory';

import {
  requestProducts,
  requestProductReviews,
  clearProducts,
} from 'pages/LP/sagas';

import saga, {
  reducer,
  requestFilters,
  setFilters,
  setQuery,
} from 'containers/Search/sagas';

const PRODUCT_FIELDS_TO_OMIT_IN_QUERY = [
  'type',
  'timeOfConsumption',
  'awards',
  'price',
  'thc',
  'cbd',
  'symptoms',
  'prescribedFor',
  'flavours',
];

type Props = {
  filter: Object,
  requestFilters: Function,
  requestProductReviews: Function,
  requestProducts: Function,
  clearProducts: Function,
  productReviews: Map<*, *>,
  products: Map<*, *>,
  category: string,
  slug: string,
  from: Moment,
  to: Moment,
  isLoading: boolean,
  isProductsLoading: boolean,
  isFilterLoading: boolean,
  page: number,
  pages: number,
  businessId: number,
  location: { pathname: string, query: { product: string }, search: string },
  push: Function,
};

type State = {
  value: Map<*, *>,
  selectedProduct: string,
  page: number,
};

class LpProductsReview extends Component<Props, State> {
  state = {
    value: fromJS({}),
    selectedProduct: '',
    page: 1,
  };

  componentWillMount() {
    const { businessId } = this.props;
    const { query } = this.props.location;
    const value = fromJS(qs.parse(query).query) || fromJS({});
    this.setState({
      value,
      selectedProduct: query.product || '',
      page: query.page || 1,
    });

    if (businessId) {
      this.props.requestFilters(this.props.category);
    }
  }

  componentWillReceiveProps(props) {
    const categoryChanged = this.props.category !== props.category;
    const needsRequestFilters =
      !props.isFilterLoading &&
      (categoryChanged ||
        (!props.filter || props.filter.get('data') === null) ||
        (props.businessId && !this.props.businessId));
    const needsRequestProducts =
      props.filter.get('data') !== null &&
      (this.props.filter.get('data') !== props.filter.get('data') ||
        this.props.location.search !== props.location.search);

    const needsRequestProductReviews =
      !props.isProductsLoading && this.props.isProductsLoading;

    const dateRangeChanged =
      this.props.from !== props.from || this.props.to !== props.to;

    if (categoryChanged || dateRangeChanged) {
      this.props.push({
        pathname: props.location.pathname,
        search: `?${qs.stringify({
          from: props.from.format('DD-MM-YYYY'),
          to: props.to.format('DD-MM-YYYY'),
          query: categoryChanged ? undefined : this.state.value.toJS(),
          product: categoryChanged
            ? undefined
            : this.state.selectedProduct || undefined,
          page: this.state.page,
        })}`,
      });

      if (categoryChanged)
        this.setState({ selectedProduct: '', value: fromJS({}) });
    }

    if (needsRequestFilters) {
      this.props.requestFilters(props.category);
      this.props.clearProducts();
    }

    if (needsRequestProducts) {
      const { model } = props.filter.toJS();
      this.requestProducts(props.category, this.state.value.toJS(), model);
    }

    if (needsRequestProductReviews) {
      const products = this.state.selectedProduct
        ? fromJS([
            {
              _id: this.state.selectedProduct,
            },
          ])
        : props.products;
      this.requestProductsReviews(products, props.from, props.to);
    }
  }

  componentWillUnmount() {
    this.props.clearProducts();
  }

  handleChange = (value: Map<*, *>) => {
    this.props.push({
      pathname: this.props.location.pathname,
      search: `?${qs.stringify({
        from: this.props.from.format('DD-MM-YYYY'),
        to: this.props.to.format('DD-MM-YYYY'),
        query: value.toJS(),
        product: this.state.selectedProduct || undefined,
        page: this.state.page,
      })}`,
    });
    this.setState({ value });
  };

  requestProducts = (category, q, model) => {
    const extraQuery = {
      ...model,
      per_page: 99999,
      select: 'id,name',
      from: undefined,
      to: undefined,
    };

    const query: {
      category?: { $in: Array<string> },
      timeOfConsumption?: { $in: Array<string> },
      awards?: { $ne?: any },
      thc?: { $gte?: number, $lte: number },
      cbd?: { $gte?: number, $lte: number },
      variants?: { [string]: any },
      $where?: string,
      reviewRating?: number,
      $and?: Array<{ [any]: any }>,
    } = {
      __t: category,
      business: this.props.businessId,
      ...omit(q, PRODUCT_FIELDS_TO_OMIT_IN_QUERY),
    };

    if (q && q.type && q.type.length) {
      query.category = { $in: q.type };
    }

    if (q && q.awards) {
      query.awards = { $ne: null };
      query.$where = 'this.awards.length>0';
    }

    if (q && q.price) {
      query.variants = {
        $elemMatch: {
          price: { $gte: Number(q.price[0]), $lte: Number(q.price[1]) },
        },
      };
    }

    const andQuery = [];

    if (q && q.thc) {
      andQuery.push({
        $or: [
          { thcHigh: { $gte: Number(q.thc[0]), $lte: Number(q.thc[1]) } },
          { thcLow: { $gte: Number(q.thc[0]), $lte: Number(q.thc[1]) } },
        ],
      });
    }

    if (q && q.cbd) {
      query.cbd = { $gte: Number(q.cbd[0]), $lte: Number(q.cbd[1]) };
      andQuery.push({
        $or: [
          { cbdHigh: { $gte: Number(q.cbd[0]), $lte: Number(q.cbd[1]) } },
          { cbdLow: { $gte: Number(q.cbd[0]), $lte: Number(q.cbd[1]) } },
        ],
      });
    }

    if (andQuery.length) {
      query.$and = andQuery;
    }
    delete query.reviewRating;

    this.props.requestProducts(query, extraQuery);
  };

  handleProductSelect = data => {
    const value = data && data.value;
    this.setState({ selectedProduct: value });
    this.props.push({
      pathname: this.props.location.pathname,
      search: `?${qs.stringify({
        from: this.props.from.format('DD-MM-YYYY'),
        to: this.props.to.format('DD-MM-YYYY'),
        query: this.state.value.toJS(),
        product: value,
        page: this.state.page,
      })}`,
    });
  };

  handlePageChange = data => {
    this.setState({ page: data });
    this.props.push({
      pathname: this.props.location.pathname,
      search: `?${qs.stringify({
        from: this.props.from.format('DD-MM-YYYY'),
        to: this.props.to.format('DD-MM-YYYY'),
        query: this.state.value.toJS(),
        product: this.state.selectedProduct,
        page: data,
      })}`,
    });
  };

  requestProductsReviews(products, from, to) {
    const { page, value } = this.state;
    const productIDs = products.toJS().map(product => product._id);
    const filterBy = value.toJS();

    const query: {
      createdOn: { $gte: Moment, $lte: Moment },
      product: { $in: Array<string> },
      rating?: number,
      timeOfConsumption?: { $in: Array<string> },
      prescribedFor?: Array<string>,
      flavours?: Array<string>,
      symptomsHelped?: { $all: Array<{ $elemMatch: { name: string } }> },
    } = {
      createdOn: { $gte: from, $lte: to },
      product: {
        $in: productIDs,
      },
    };

    if (
      filterBy &&
      filterBy.timeOfConsumption &&
      filterBy.timeOfConsumption.length
    ) {
      query.timeOfConsumption = { $in: filterBy.timeOfConsumption };
    }

    if (filterBy && filterBy.prescribedFor && filterBy.prescribedFor.length) {
      query.prescribedFor = filterBy.prescribedFor;
    }

    if (filterBy && filterBy.flavours && filterBy.flavours.length) {
      query.flavours = filterBy.flavours;
    }

    if (filterBy && filterBy.symptoms && filterBy.symptoms.length) {
      query.symptomsHelped = {
        $all: filterBy.symptoms.map(item => ({ $elemMatch: { name: item } })),
      };
    }

    if (filterBy && filterBy.reviewRating) {
      query.rating = filterBy.reviewRating;
    }

    this.props.requestProductReviews(query, { page, populate: 'user,product' });
  }

  render() {
    const {
      filter,
      category,
      productReviews,
      isLoading,
      isFilterLoading,
      page,
      pages,
      slug,
      products,
    } = this.props;
    return (
      <div className="row">
        <div className="small-12 medium-4 large-3 column">
          {filter.get('data') === null ? (
            <Preloader />
          ) : (
            <div>
              <ProductFilter
                category={category}
                value={this.state.value}
                options={filter.get('data')}
                onChange={this.handleChange}
                lpVersion
              />
            </div>
          )}
        </div>

        {products &&
          !isFilterLoading && (
            <div className="small-12 medium-8 large-9 column">
              <div className="row">
                <div className="column small-12 medium-6 large-4 mb-lg">
                  <div className="row align-middle">
                    <div className="column shrink">
                      <div className="productShowFilter__label">
                        View {pluralizeCategory(category)}
                      </div>
                    </div>
                    <div className="column">
                      <CustomSelect
                        className="large"
                        onChange={this.handleProductSelect}
                        meta={['product']}
                        value={this.state.selectedProduct}
                        options={products}
                        clearable={!!this.state.selectedProduct}
                        placeholder={`Type ${category} name`}
                        searchable
                      />
                    </div>
                  </div>
                </div>
              </div>

              {productReviews &&
                productReviews.size === 0 && (
                  <div>
                    Sorry! No reviews were found. Please try changing your query
                  </div>
                )}

              <ReviewList
                data={productReviews}
                category={category}
                currentUser={fromJS({})}
                isLoading={isLoading}
                review={fromJS({})}
                slug={slug}
                lpVersion
              />
              <Pagination
                forcePage={page}
                pageCount={pages}
                onPageChange={this.handlePageChange}
              />
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const category = {
    strains: 'Strain',
    oils: 'Oil',
    business: 'business',
  }[props.match.params.category];

  return {
    businessId: state.getIn(['lp', 'businesses', 'data', 0, 'id']),
    slug: state.getIn(['lp', 'businesses', 'data', 0, 'slug']),
    productReviews: state.getIn(['lp', 'productReviews', 'data', 'hits']),
    products: state.getIn(['lp', 'products', 'data', 'hits']),
    isProductsLoading: state.getIn(['lp', 'products', 'isLoading']),
    page: state.getIn(['lp', 'productReviews', 'data', 'page']),
    pages: state.getIn(['lp', 'productReviews', 'data', 'pages']),
    isLoading: state.getIn(['lp', 'productReviews', 'isLoading']),
    filter: state.getIn(['lpReviews', category, 'filter']),
    query: state.getIn(['lpReviews', category, 'filter', 'query']),
    isFilterLoading: state.getIn([
      'lpReviews',
      category,
      'filter',
      'isLoading',
    ]),
    category,
  };
};

const mapDispatchToProps = dispatch => ({
  clearProducts: () => dispatch(clearProducts()),
  requestFilters: category => dispatch(requestFilters(category)),
  requestProductReviews: (query, queryString) =>
    dispatch(requestProductReviews(query, queryString)),
  setFilters: (category, parsedSearch) =>
    dispatch(setFilters(category, parsedSearch)),
  requestProducts: (query, q) => dispatch(requestProducts(query, q)),
  setQuery: (category, value) => dispatch(setQuery(category, value)),
  push: query => dispatch(push(query)),
});

export default compose(
  injectSagas({ key: 'lpReviews', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LpProductsReview);
