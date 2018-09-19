// @flow

import React, { Component } from 'react';
import deepReplace from 'utils/deepReplaceToString';
import FILTER_OPTIONS from 'enum/filter/options';

import CustomSelect from 'components/CustomSelect';

import './styles.scss';

type Props = {
  requestProducts: Function,
  filter: Object,
};

class ProductFilter extends Component<Props> {
  onSelectChange = (value: Object, path: string) => {
    this.props.requestProducts(path, deepReplace(value));
  };

  render() {
    const { filter } = this.props;
    return (
      <div className="productShowFilter">
        <div className="row">
          <div className="column small-12 medium-6 large-4">
            <div className="row align-middle">
              <div className="column shrink">
                <div className="productShowFilter__label">Sort by</div>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  onChange={this.onSelectChange}
                  meta={['model', 'sort']}
                  clearable={false}
                  value={filter.getIn(['model', 'sort'])}
                  options={FILTER_OPTIONS.FILTER_SORT_OPTIONS}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductFilter;
