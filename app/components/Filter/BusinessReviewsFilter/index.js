// @flow

import React, { Component } from 'react';

import type { Map } from 'immutable';
import { fromJS } from 'immutable';
import { generate } from 'shortid';
import { Checkbox as CheckboxItem, CheckboxGroup } from 'react-checkbox-group';

import Link from 'components/Link';
import Icon from 'components/Icon';
import StarRating from 'components/StarRating';

import FILTER_OPTIONS from 'enum/filter/options';

import IconShowAll from 'images/sprite/ClearAll.svg';
import './styles.scss';

type Props = {
  value: Map<*, *>,
  onChange?: Function,
};

class BusinessReviewsFilter extends Component<Props> {
  onCheckGroupChange = (param: Array<string>, queryType: Array<string>) => {
    if (this.props.onChange) {
      let newValue;
      if (!queryType) {
        newValue = this.props.value.deleteIn(param);
      } else {
        newValue = this.props.value.setIn(param, fromJS(queryType));
      }

      this.props.onChange(newValue);
    }
  };

  clearFilter = () => {
    if (this.props.onChange) {
      this.props.onChange(fromJS({}));
    }
  };

  render() {
    const { value } = this.props;

    let queryRating = [];

    if (value) {
      const rating = value.getIn(['rating']);
      if (rating) {
        queryRating = rating.toJS();
      }
    }
    return (
      <div className="businessReviewFilter">
        <div className="column small-12">
          <div className="row align-middle">
            <div className="column small-12">
              <div className="businessReviewFilter__label">Rating</div>
            </div>
            <CheckboxGroup
              name="queryRating"
              value={queryRating}
              onChange={v => this.onCheckGroupChange(['rating'], v)}
              className="small-12 column"
            >
              <div className="businessReviewFilter__input">
                {FILTER_OPTIONS.RATING_OPTIONS.map(option => (
                  <label
                    className="businessReviewFilter__checkboxItem mb-sm"
                    key={generate()}
                    htmlFor={option}
                  >
                    <CheckboxItem
                      id={option}
                      value={option}
                      className="mr-mn"
                    />
                    <StarRating
                      readonly
                      size={19}
                      initialRating={Number(option)}
                    />
                  </label>
                ))}
              </div>
            </CheckboxGroup>
          </div>
        </div>

        <div className="row">
          <div className="column">
            <Link
              className="businessReviewFilter__clearAll"
              onClick={this.clearFilter}
            >
              <Icon glyph={IconShowAll} size={14} className="mr-sm" />
              Clear all filters
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default BusinessReviewsFilter;
