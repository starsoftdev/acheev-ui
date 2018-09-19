// @flow

import React, { Component } from 'react';
import CustomSelect from 'components/CustomSelect';
import FILTER_OPTIONS from 'enum/filter/options';

type Props = {
  requestProducts: Function,
  requestBusinessFilters: Function,
  model: Object,
};

class BusinessFilter extends Component<Props> {
  onSelectChange = (value: Object, path: string) => {
    this.props.requestBusinessFilters(path, value);
  };
  onPageChange = (value: Object, path: string) => {
    this.props.requestProducts(path, value);
  };
  render() {
    const { model } = this.props;
    return (
      <div>
        <div className="filter__bottom row">
          <div className="column small-6">
            <div className="filter__topItem row align-middle">
              <div className="shrink column npr">
                <div className="filter__label">Show</div>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  onChange={this.onPageChange}
                  meta={['per_page']}
                  value={model.get('perPage').toJS()}
                  clearable={false}
                  options={FILTER_OPTIONS.FILTER_SHOW_OPTIONS}
                />
              </div>
            </div>
          </div>
          <div className="column small-6">
            <div className="filter__topItem row align-middle">
              <div className="shrink column npr">
                <div className="filter__label">Province</div>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  onChange={this.onSelectChange}
                  meta={['province']}
                  value={model.get('province').toJS()}
                  clearable={false}
                  options={FILTER_OPTIONS.FILTER_PROVINCE_OPTIONS}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BusinessFilter;
