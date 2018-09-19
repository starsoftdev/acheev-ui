// @flow

import React, { Component } from 'react';
import cx from 'classnames';

import Button from 'components/Button';
import CustomSelect from 'components/CustomSelect';

import './styles.scss';

type Props = {
  className?: Function,
  typeOptions: Array<Object>,
  sortOptions: Array<Object>,
  typeValue: string,
  sortValue: string,
  sort: Function,
  changeType: Function,
};
class ReviewsBannerFilter extends Component<
  Props,
  {
    showFilter: boolean,
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showFilter: true,
    };
  }
  render() {
    const {
      className,
      typeOptions,
      sortOptions,
      typeValue,
      sortValue,
      changeType,
      sort,
    } = this.props;
    const mergedClassName = cx(className, 'bannerFilter mb-xl');
    return (
      <div className={mergedClassName}>
        <div className="row show-for-small-only">
          <div className="column small-12">
            <Button
              className="small expanded mb-mn"
              onClick={() =>
                this.setState({ showFilter: !this.state.showFilter })}
            >
              <strong>{this.state.showFilter ? 'Hide' : 'Show'} Filters</strong>
            </Button>
          </div>
        </div>
        {this.state.showFilter && (
          <div className="row">
            <div className="column small-12 medium-6 large-4">
              <div className="row align-middle mb-sm">
                <div className="columns small-12 npr mb-sm">
                  <label htmlFor="type">Type of Review:</label>
                </div>
                <div className="columns small-12 mb-sm">
                  <CustomSelect
                    name="type"
                    className="large"
                    options={typeOptions}
                    value={typeValue}
                    clearable={false}
                    onChange={e => {
                      changeType(e.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="column small-12 medium-6 large-4">
              <div className="row align-middle mb-sm">
                <div className="columns small-12 npr mb-sm">
                  <label htmlFor="type">Sort By:</label>
                </div>
                <div className="columns small-12 mb-sm">
                  <CustomSelect
                    name="sort"
                    className="large"
                    options={sortOptions}
                    value={sortValue}
                    clearable={false}
                    onChange={e => {
                      sort(e.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ReviewsBannerFilter;
