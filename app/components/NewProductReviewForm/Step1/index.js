// @flow

import React, { Component } from 'react';

import ValidationMessage from 'components/ValidationMessage';
import StarRating from 'components/StarRating';
import RadioGroup from 'components/RadioGroup';
type Props = {
  reviewScores: Object,
  model: Object,
  onChangeRate: Function,
  onChangePurchase: Function,
  productType: string,
};
class NewProductReviewFormStep1 extends Component<Props> {
  render() {
    const { reviewScores, model, productType } = this.props;
    return (
      <div>
        <div className="row mb-md">
          <div className="column">
            <div className="newProductReviewForm__points">
              {reviewScores.rating}
              pts
            </div>
            <div className="newProductReviewForm__label">
              What would you rate this {productType}? (required)
            </div>
            <StarRating
              initialRating={model.rating}
              readonly={false}
              size={55}
              onChange={rate => {
                this.props.onChangeRate(rate);
              }}
              id="rating"
            />
            <ValidationMessage for="rating" />
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <div className="newProductReviewForm__points">
              {reviewScores.wouldPurchaseAgain}
              pts
            </div>
            <div className="newProductReviewForm__label">
              Would you purchase this product again?
            </div>
            <RadioGroup
              id="wouldPurchaseAgain"
              name="wouldPurchaseAgain"
              className="newProductReviewForm__inlineRadio"
              itemClassName="mr-md"
              options={[
                {
                  label: 'Yes',
                  value: true,
                },
                {
                  label: 'No',
                  value: false,
                },
              ]}
              onChange={this.props.onChangePurchase}
              value={model.wouldPurchaseAgain}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default NewProductReviewFormStep1;
