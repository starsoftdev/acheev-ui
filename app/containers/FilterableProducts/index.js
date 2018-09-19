// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import FilterableProducts from 'components/FilterableProducts';
import { requestFilterableProducts } from 'pages/Home/sagas';

type Props = {
  data: Object,
  category: string,
  requestFilterableProducts: Function,
  linksTo: string,
  border: ?Boolean,
};

class FilterableProductsContainer extends Component<Props> {
  componentWillMount() {
    this.props.requestFilterableProducts(0, this.props.category);
  }
  render() {
    const { data, linksTo, border } = this.props;
    return (
      <FilterableProducts
        category={this.props.category}
        data={data}
        linksTo={linksTo}
        requestItems={(index, category) =>
          this.props.requestFilterableProducts(index, category)}
        border={border}
      />
    );
  }
}

const mapStateToPtops = (state, props) => ({
  data: state.getIn(['home', props.category]),
});

const mapDispatchToProps = dispatch => ({
  requestFilterableProducts: (index, category) =>
    dispatch(requestFilterableProducts(index, category)),
});

export default connect(mapStateToPtops, mapDispatchToProps)(
  FilterableProductsContainer
);
