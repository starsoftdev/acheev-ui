// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { reject } from 'lodash-es';

import ValidationMessage from 'components/ValidationMessage';
import TagList from 'components/TagList';
import ImageRadioGroup from 'components/ImageRadioGroup';
import Select from 'components/CustomSelect';

import FORM_OPTIONS from 'enum/form/options';

const hoursOptions = [
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '4.5',
  '5',
  '5.5',
  '6',
];

type Props = {
  reviewScores: Object,
  model: Object,
  isOil: boolean,
  onChangeMethodOfConsumption: Function,
  onChangeTimeOfConsumption: Function,
  onChangeTaglist: Function,
};
class NewProductReviewFormStep3 extends Component<Props> {
  render() {
    const { reviewScores, model, isOil } = this.props;
    return (
      <div>
        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Duration of High (in hours)
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.durationOfEffect}
              pts
            </span>
          </div>
        </div>

        <div className="row mb-mx">
          <div className="column">
            <Select
              placeholder="Select duration..."
              clearable
              name="durationOfEffect"
              options={hoursOptions}
              value={model.durationOfEffect}
              onChange={item =>
                this.props.onChangeTaglist(
                  'durationOfEffect',
                  item ? item.value : item
                )
              }
            />
            <ValidationMessage for="durationOfEffect" />
          </div>
        </div>
        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Onset Before High (in hours)
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.onset}
              pts
            </span>
          </div>
        </div>

        <div className="row mb-mx">
          <div className="column">
            <Select
              placeholder="Select duration..."
              clearable
              name="onset"
              options={hoursOptions}
              value={model.onset}
              onChange={item =>
                this.props.onChangeTaglist('onset', item ? item.value : item)
              }
            />
            <ValidationMessage for="onset" />
          </div>
        </div>
        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Flavours
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.flavours}
              pts
            </span>
          </div>
        </div>

        <div>
          <TagList
            value={model.flavours}
            typeaheadOptions={FORM_OPTIONS.FLAVOUR_OPTIONS}
            inputPlaceholder="Type a flavour here"
            className="mb-mx"
            onChange={value => this.props.onChangeTaglist('flavours', value)}
          />
          <ValidationMessage for="flavours" />
        </div>

        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Preferred Method Of Consumption
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.methodOfConsumption}
              pts
            </span>
          </div>
        </div>
        <div>
          <ImageRadioGroup
            name="methodOfConsumption"
            itemClassName={cx(
              'column small-6',
              isOil ? 'medium-4' : 'medium-6'
            )}
            className="row mb-mx"
            value={model.methodOfConsumption}
            options={
              isOil
                ? reject(FORM_OPTIONS.CONSUMPTION_METHODS_OPTIONS, {
                    value: 'bong',
                  })
                : FORM_OPTIONS.CONSUMPTION_METHODS_OPTIONS
            }
            onChange={this.props.onChangeMethodOfConsumption}
          />
          <ValidationMessage for="methodOfConsumption" />
        </div>

        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Preferred Time Of Consumption
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.timeOfConsumption}
              pts
            </span>
          </div>
        </div>
        <div>
          <ImageRadioGroup
            name="timeOfConsumption"
            itemClassName="column small-6 medium-6"
            className="row mb-mx"
            value={model.timeOfConsumption}
            options={FORM_OPTIONS.TIME_OF_CONSUMPTION_OPTIONS}
            onChange={this.props.onChangeTimeOfConsumption}
          />
          <ValidationMessage for="timeOfConsumption" />
        </div>
      </div>
    );
  }
}

export default NewProductReviewFormStep3;
