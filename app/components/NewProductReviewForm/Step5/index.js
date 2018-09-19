// @flow

import React, { Component } from 'react';
import { Field } from 'react-formal';

import ValidationMessage from 'components/ValidationMessage';
import DatePicker from 'components/DatePicker';

type Props = {
  reviewScores: Object,
  model: Object,
  onDatePickerChange: Function,
};
class NewProductReviewFormStep5 extends Component<Props> {
  render() {
    const { reviewScores, model } = this.props;

    return (
      <div>
        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Batch Lot
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.batch}
              pts
            </span>
          </div>
        </div>
        <div className="row mb-mx">
          <div className="columns">
            <Field className="accent" name="batch" id="batch" type="text" />
            <ValidationMessage for="batch" />
          </div>
        </div>
        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Date of purchase
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.purchasedOn}
              pts
            </span>
          </div>
        </div>
        <div className="row mb-mx">
          <div className="columns">
            <DatePicker
              clearable
              value={model.purchasedOn}
              yearCounts={5}
              expanded
              onChange={this.props.onDatePickerChange}
            />
            <ValidationMessage for="purchasedOn" />
          </div>
        </div>
      </div>
    );
  }
}

export default NewProductReviewFormStep5;
