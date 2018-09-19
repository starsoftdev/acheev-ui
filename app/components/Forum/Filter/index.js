// @flow

import React, { Component } from 'react';
import { List } from 'immutable';
import CustomSelect from 'components/CustomSelect';
import transformOptions from 'utils/transformOptions';
import FILTER_OPTIONS from 'enum/filter/options';

type Props = {
  onChangeFilters: Function,
  categories: List<*>,
  defaultCategory?: string,
  defaultSort?: string,
  defaultQuestionState?: string,
};

class ForumFilter extends Component<Props> {
  onChangeFilter = (data: Object, path: string) => {
    this.props.onChangeFilters(path, data.value);
  };
  render() {
    const {
      categories,
      defaultCategory,
      defaultSort,
      defaultQuestionState,
    } = this.props;

    return (
      <div>
        <div className="row align-middle">
          <div className="small-12 medium-6 large-4 column mb-mn">
            <div className="row align-middle">
              <div className="shrink column npr t-uppercase">
                <label htmlFor="category">Category: </label>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  name="category"
                  onChange={this.onChangeFilter}
                  meta={['category']}
                  value={defaultCategory}
                  clearable={false}
                  options={transformOptions(categories.toJS(), true)}
                />
              </div>
            </div>
          </div>
          <div className="small-12 medium-6 large-4 column mb-mn">
            <div className="row align-middle">
              <div className="shrink column npr t-uppercase">
                <label htmlFor="select1">Sort by: </label>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  name="sort"
                  onChange={this.onChangeFilter}
                  meta={['sort']}
                  value={defaultSort}
                  clearable={false}
                  options={FILTER_OPTIONS.QUESTIONS_FILTER_SORT_OPTIONS}
                />
              </div>
            </div>
          </div>
          <div className="small-12 medium-6 large-4 column mb-mn">
            <div className="row align-middle">
              <div className="shrink column npr t-uppercase">
                <label htmlFor="select2">Status: </label>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  name="questionState"
                  onChange={this.onChangeFilter}
                  meta={['questionState']}
                  value={defaultQuestionState}
                  clearable={false}
                  options={FILTER_OPTIONS.QUESTIONS_FILTER_STATE_OPTIONS}
                />
              </div>
            </div>
          </div>
          <div className="mb-xxl hide-for-small-only">&nbsp;</div>
        </div>
      </div>
    );
  }
}

export default ForumFilter;
