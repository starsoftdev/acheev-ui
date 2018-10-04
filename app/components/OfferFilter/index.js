// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import { cloneDeep } from 'lodash-es';

import Link from 'components/Link';
import RadioGroup from 'components/RadioGroup';
import { Checkbox as CheckboxItem, CheckboxGroup } from 'react-checkbox-group';
import CustomSelect from 'components/CustomSelect';

import transformOptions from 'utils/transformOptions';

import './styles.scss';

type State = {
  status: Array<string>,
};

class OfferFilter extends Component<{}, State> {
  state = {
    status: [],
  };
  onCheckGroupChange = (path: string, value: Array) => {
    const newState = cloneDeep(this.state);
    newState[path] = value;
    this.setState(newState);
  };
  onChangeDeliveryTime = (value: Number) => {
    const newState = cloneDeep(this.state);
    newState.deliveryTime = value;
    this.setState(newState);
  };
  renderCheckboxGroup = (path: string, options: Object) => {
    const value = this.state[path];
    return (
      <CheckboxGroup
        value={value}
        onChange={val => this.onCheckGroupChange(path, val)}
      >
        {options.map(option => {
          const id = generate();
          return (
            <label
              className="offerFilter__checkboxItem"
              key={generate()}
              htmlFor={`${id}${option.value}`}
            >
              <CheckboxItem
                id={`${id}${option.value}`}
                value={option.value}
                className="mr-mn"
              />
              <span className="fs-md t-capitalize">{option.label}</span>
            </label>
          );
        })}
      </CheckboxGroup>
    );
  };
  render() {
    return (
      <div className="offerFilter">
        <div className="row">
          <div className="column">
            <h1 className="fs-mx c-darkest-gray">Delivery Time</h1>
            <RadioGroup
              itemClassName="mr-md"
              options={[
                {
                  label: 'Up to 24 hours',
                  value: 1,
                },
                {
                  label: 'Up to 3 days',
                  value: 3,
                },
                {
                  label: 'Up to 7 days',
                  value: 7,
                },
                {
                  label: 'Any',
                  value: 0,
                },
              ]}
              value={this.state.deliveryTime}
              onChange={this.onChangeDeliveryTime}
            />
          </div>
        </div>
        <div className="offerFilter__divider" />
        <div className="row">
          <div className="column">
            <h1 className="fs-mx c-darkest-gray">Status</h1>
            {this.renderCheckboxGroup('status', [
              {
                label: 'Online',
                value: 'Online',
              },
              {
                label: 'Offline',
                value: 'Offline',
              },
            ])}
          </div>
        </div>
        <div className="offerFilter__divider" />
        <div className="row">
          <div className="column">
            <div className="row">
              <div className="column">
                <h1 className="fs-mx c-darkest-gray">Style</h1>
              </div>
              <div className="column shrink">
                <Link className="offerFilter__btnGradient">Clear</Link>
              </div>
            </div>
            {this.renderCheckboxGroup('style', [
              {
                label: 'Versatile',
                value: 'Versatile',
              },
              {
                label: 'Minimalist',
                value: 'Minimalist',
              },
              {
                label: 'Elegant',
                value: 'Elegant',
              },
              {
                label: '3 Dimension',
                value: '3 Dimension',
              },
            ])}
            <Link className="offerFilter__btnGradient">+ Show more</Link>
          </div>
        </div>
        <div className="offerFilter__divider" />
        <div className="row">
          <div className="column">
            <h1 className="fs-mx c-darkest-gray">File Format</h1>
            {this.renderCheckboxGroup('format', [
              {
                label: 'JPG',
                value: 'JPG',
              },
              {
                label: 'PNG',
                value: 'PNG',
              },
              {
                label: 'PDF',
                value: 'PDF',
              },
              {
                label: 'SVG',
                value: 'SVG',
              },
            ])}
            <Link className="offerFilter__btnGradient">+ Show more</Link>
          </div>
        </div>
        <div className="offerFilter__divider" />
        <div className="row">
          <div className="column">
            <h1 className="fs-mx c-darkest-gray">Seller Level</h1>
            {this.renderCheckboxGroup('level', [
              {
                label: 'Level One',
                value: 'Level One',
              },
              {
                label: 'Level Two',
                value: 'Level Two',
              },
              {
                label: 'Top Rated Seller',
                value: 'Top Rated Seller',
              },
            ])}
          </div>
        </div>
        <div className="offerFilter__divider" />
        <div className="row">
          <div className="column">
            <h1 className="fs-mx c-darkest-gray">Seller Language</h1>
            {this.renderCheckboxGroup('language', [
              {
                label: 'English',
                value: 'English',
              },
              {
                label: 'Spanish',
                value: 'Spanish',
              },
              {
                label: 'Portuguese',
                value: 'Portuguese',
              },
              {
                label: 'Indonesian',
                value: 'Indonesian',
              },
            ])}
            <Link className="offerFilter__btnGradient">+ Show more</Link>
          </div>
        </div>
        <div className="offerFilter__divider" />
        <div className="row">
          <div className="column">
            <h1 className="fs-mx c-darkest-gray">Seller Location</h1>
            <CustomSelect
              className="large"
              value={{ label: 'English', value: 'English' }}
              options={transformOptions(['English', 'Spanish', 'Portuguese'])}
              clearable={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default OfferFilter;