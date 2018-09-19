// @flow

import React, { Component } from 'react';
import type { List, Map } from 'immutable';
import { connect } from 'react-redux';

import LpProductList from 'components/LP/ProductList';
import Button from 'components/Button';
import Link from 'components/Link';

import { requestBusinesses, requestProducts } from 'pages/LP/sagas';

type Props = {
  products: List<Map<*, *>>,
  user: Object,
  isLoading: boolean,
  requestBusinesses: Function,
  requestProducts: Function,
  businessId: string,
};

class LpProductsPage extends Component<Props> {
  componentWillMount() {
    const { user, businessId } = this.props;
    if (!businessId) {
      this.props.requestBusinesses(user.get('id'));
    } else {
      this.requestProducts(businessId);
    }
  }

  componentWillReceiveProps(newProps: Props) {
    const { businessId } = newProps;
    if (businessId && !this.props.businessId) {
      this.requestProducts(businessId);
    }
  }

  requestProducts = businessId => {
    this.props.requestProducts(
      { business: businessId },
      {
        per_page: 99999,
        select:
          'name,__t,variants,reviewCount,rating,createdOn,updatedOn,slug,id',
      }
    );
  };

  render() {
    const { products, isLoading } = this.props;
    return (
      <div className="row column">
        {products &&
          !products.size && (
            <div className="row column">
              <h3 className="text-center mb-xl">
                This producer doesn&apos;t have any products yet
              </h3>
            </div>
          )}
        <div className="mt-lg mb-lg text-center">
          <Button
            className="mr-md"
            element={Link}
            to="/lp/products/strains/new"
          >
            Add a new Strain
          </Button>
          <Button element={Link} to="/lp/products/oils/new">
            Add a new Oil
          </Button>
        </div>
        <hr />
        <LpProductList
          className="mb-xl"
          isLoading={isLoading}
          data={products}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'lpUser']),
  products: state.getIn(['lp', 'products', 'data', 'hits']),
  isLoading: state.getIn(['lp', 'products', 'isLoading']),
  businessId: state.getIn(['lp', 'businesses', 'data', 0, 'id']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinesses: id => dispatch(requestBusinesses(id)),
  requestProducts: (query, q) => dispatch(requestProducts(query, q)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LpProductsPage);
