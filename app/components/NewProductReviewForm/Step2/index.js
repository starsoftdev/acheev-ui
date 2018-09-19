// @flow

import React, { Component } from 'react';

import ValidationMessage from 'components/ValidationMessage';
import TagList from 'components/TagList';

import FORM_OPTIONS from 'enum/form/options';

type Props = {
  reviewScores: Object,
  model: Object,
  onChangeTaglist: Function,
};

class NewProductReviewFormStep2 extends Component<Props> {
  render() {
    const { reviewScores, model } = this.props;
    return (
      <div>
        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Positive Effects
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.positiveEffects}pts
            </span>
          </div>
        </div>

        <div>
          <TagList
            value={model.positiveEffects}
            typeaheadOptions={FORM_OPTIONS.POSITIVE_EFFECTS_OPTIONS}
            inputPlaceholder="Type a positive effect here"
            className="mb-mx"
            showEffects
            clearable={false}
            disableOptionClearable
            onChange={value =>
              this.props.onChangeTaglist('positiveEffects', value)
            }
          />
          <ValidationMessage for="positiveEffects" />
        </div>

        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Negative Effects
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.negativeEffects}pts
            </span>
          </div>
        </div>

        <div>
          <TagList
            value={model.negativeEffects}
            typeaheadOptions={FORM_OPTIONS.NEGATIVE_EFFECTS_OPTIONS}
            inputPlaceholder="Type a negative effect here"
            className="mb-mx"
            showEffects
            clearable={false}
            disableOptionClearable
            onChange={value =>
              this.props.onChangeTaglist('negativeEffects', value)
            }
          />
          <ValidationMessage for="negativeEffects" />
        </div>

        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Symptoms Helped
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.symptomsHelped}pts
            </span>
          </div>
        </div>

        <div>
          <TagList
            value={model.symptomsHelped}
            typeaheadOptions={FORM_OPTIONS.SYMPTOMS_HELPED_OPTIONS}
            inputPlaceholder="Type a symptom here"
            className="mb-mx"
            showEffects
            clearable={false}
            disableOptionClearable
            onChange={value =>
              this.props.onChangeTaglist('symptomsHelped', value)
            }
          />
          <ValidationMessage for="symptomsHelped" />
        </div>
      </div>
    );
  }
}

export default NewProductReviewFormStep2;
