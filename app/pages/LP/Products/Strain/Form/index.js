// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';

import LpProductForm from 'components/LP/ProductForm';

import {
  requestBusinesses,
  submitProduct,
  requestProduct,
  uploadLogo,
} from 'pages/LP/sagas';

type Props = {
  match: Object,
  business: Map<*, *>,
  product: Map<*, *>,
  user: Object,
  requestBusinesses: Function,
  requestProduct: Function,
  isLoading: boolean,
  isUpdating: boolean,
  error: string,
  success: string,
  submitProduct: Function,
  uploadLogo: Function,
  logo: string,
};

class LpStrainFormPage extends Component<Props> {
  render() {
    const {
      business,
      product,
      user,
      match: { params },
      error,
      success,
      isLoading,
      isUpdating,
      logo,
    } = this.props;
    return (
      <LpProductForm
        category="strain"
        productId={params.slug}
        business={business}
        product={product}
        user={user}
        requestBusinesses={this.props.requestBusinesses}
        requestProduct={this.props.requestProduct}
        isLoading={isLoading}
        isUpdating={isUpdating}
        error={error}
        success={success}
        submitProduct={this.props.submitProduct}
        uploadLogo={this.props.uploadLogo}
        logo={logo}
      />
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'lpUser']),
  business: state.getIn(['lp', 'businesses', 'data', 0]),
  product: state.getIn(['lp', 'product', 'data']),
  isLoading: state.getIn(['lp', 'product', 'isLoading']),
  isUpdating: state.getIn(['lp', 'product', 'isUpdating']),
  error: state.getIn(['lp', 'product', 'error']),
  success: state.getIn(['lp', 'product', 'success']),
  logo: state.getIn(['lp', 'logo', 'path']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinesses: id => dispatch(requestBusinesses(id)),
  requestProduct: id => dispatch(requestProduct(id)),
  submitProduct: (id, data) => dispatch(submitProduct(id, data)),
  uploadLogo: payload => dispatch(uploadLogo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LpStrainFormPage);
