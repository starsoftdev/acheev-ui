// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import type { List, Map } from 'immutable';
import { history } from 'components/ConnectedRouter';
import { generate } from 'shortid';
import { get } from 'utils/immutable';
import title from 'utils/title';

import Helmet from 'components/Helmet';
import ProductsList from 'components/ProductsList';
import Pagination from 'components/Pagination';
import BorderedTitle from 'components/BorderedTitle';
import Tab from 'components/RouterTab';
import ButtonGroup from 'components/ButtonGroup';
import Select from 'components/Select';

import {
  requestBusinessProfile,
  requestBusinessProducts,
  followLikeBusiness,
  requestBusinessFollows,
  requestBusinessLikes,
  setBreadcrumbPath,
} from 'containers/BusinessProfile/sagas';

type Props = {
  isLoading: boolean,
  isLoadingProducts: boolean, // eslint-disable-line react/no-unused-prop-types
  business: Object,
  products: List<Map<string, Object>>,
  productsTotal: number,
  productPages: number,
  slug: string,
  requestBusinessProducts: Function,
  setBreadcrumbPath: Function,
};

class ProductListContainer extends Component<Props> {
  componentDidMount() {
    const { business } = this.props;
    if (business && business.get('id')) {
      this.props.requestBusinessProducts(business.get('id'));
      this.setBreadcrumbPath(business);
    }
  }

  componentDidUpdate(oldProps: Props) {
    const wasLoadingProfile = oldProps.isLoading;
    const { isLoading, isLoadingProducts, business } = this.props;
    const isProfileLoaded = isLoading === false && !!get(business, 'id');

    if (isLoadingProducts === false && wasLoadingProfile && isProfileLoaded) {
      this.props.requestBusinessProducts(business.get('id'));
    }
  }

  setBreadcrumbPath = (data: Object) => {
    const { slug } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '/businesses',
        title: 'Businesses',
      },
      {
        link: '/producers',
        title: 'Producers',
      },
      {
        link: `/producers/${slug}`,
        title: data ? data.get('name') : '',
      },
      {
        link: '',
        title: 'Products',
      },
    ]);
    this.props.setBreadcrumbPath(breadcrumbPath);
  };

  render() {
    const {
      business,
      products,
      productsTotal,
      productPages,
      slug,
    } = this.props;

    const businessId = business.get('id');
    const baseUrl = `/producers/${slug}`;
    const options = ['About', 'Reviews', 'Products'];
    return (
      <div>
        <Helmet
          title={title({
            name: get(business, 'name'),
            type: get(business, '__t'),
            postfix: 'Products',
          })}
        />
        <ButtonGroup className="centered mb-lg hide-for-small-only">
          <Tab to={baseUrl}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>Business Reviews</Tab>
          <Tab to={`${baseUrl}/product-reviews`}>Product Reviews</Tab>
          <Tab to={`${baseUrl}/products`}>Products</Tab>
        </ButtonGroup>
        <div className="row">
          <div className="column">
            <Select
              className="blackTheme mb-lg show-for-small-only b-primary"
              value="Products"
              onChange={e => {
                if (e.target.value === 'About') {
                  history.push(baseUrl);
                } else {
                  history.push(`${baseUrl}/${e.target.value.toLowerCase()}`);
                }
              }}
            >
              {options.map(item => (
                <option key={generate()} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <BorderedTitle>Showing {productsTotal} products</BorderedTitle>
            <ProductsList data={products} />
            <Pagination
              pageCount={productPages}
              onPageChange={e =>
                this.props.requestBusinessProducts(businessId, ['page'], e)
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  business: state.getIn(['profile', 'business', 'data']),
  isLoading: state.getIn(['profile', 'business', 'isLoading']),
  error: state.getIn(['profile', 'business', 'error']),
  products: state.getIn(['profile', 'products', 'data', 'hits']),
  productsTotal: state.getIn(['profile', 'products', 'data', 'count']),
  productPages: state.getIn(['profile', 'products', 'data', 'pages']),
  isLoadingProducts: state.getIn(['profile', 'products', 'isLoading']),
  businessFollowLike: state.getIn(['profile', 'businessFollowLike']),
  follows: state.getIn(['profile', 'follows']),
  likes: state.getIn(['profile', 'likes']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinessProfile: (slug, value) =>
    dispatch(requestBusinessProfile(slug, value)),
  requestBusinessProducts: (category, id, value) =>
    dispatch(requestBusinessProducts(category, id, value)),
  followLikeBusiness: (businessId, actionType) =>
    dispatch(followLikeBusiness(businessId, actionType)),
  requestBusinessFollows: businessId =>
    dispatch(requestBusinessFollows(businessId)),
  requestBusinessLikes: businessId =>
    dispatch(requestBusinessLikes(businessId)),
  setBreadcrumbPath: path => dispatch(setBreadcrumbPath(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductListContainer);
