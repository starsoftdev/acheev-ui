// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import { cloneDeep } from 'lodash-es';

import Typeahead from 'components/Typeahead';

import TagItem from './TagItem';
import EffectItem from './EffectItem';

import './styles.scss';

type Props = {
  value?: Array<*>,
  className?: string,
  onChange?: Function,
  inputPlaceholder?: string,
  typeaheadOptions?: Array<string>,
  readOnly?: boolean,
  showEffects?: boolean,
  creatable?: boolean,
  disableOptionClearable?: boolean,
};

class TagList extends Component<Props> {
  onTypeaheadChange = (value: Array<string>) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };
  onEffectChange = (index: number, value: number) => {
    const { onChange } = this.props;
    if (index > -1) {
      const newValue = cloneDeep(this.props.value);
      newValue[index].strength = value;
      if (onChange) {
        onChange(newValue);
      }
    }
  };
  onEffectRemove = (index: number) => {
    const { onChange } = this.props;
    if (index > -1) {
      const newValue = cloneDeep(this.props.value);
      newValue.splice(index, 1);
      if (onChange) {
        onChange(newValue);
      }
    }
  };
  render() {
    const {
      readOnly = false,
      value,
      className,
      inputPlaceholder,
      typeaheadOptions,
      showEffects,
      creatable = false,
      disableOptionClearable,
      ...otherProps
    } = this.props;
    const mergedClassName = cx('tagList', className);
    const placeholder = inputPlaceholder || 'Enter text here...';
    return (
      <div className={mergedClassName}>
        {readOnly &&
          !showEffects && (
            <div className="tagList__list">
              {value &&
                value.map(itemValue => (
                  <TagItem
                    value={itemValue}
                    readOnly={readOnly}
                    key={generate()}
                  />
                ))}
            </div>
          )}
        {!readOnly && (
          <Typeahead
            options={typeaheadOptions}
            placeholder={placeholder}
            onChange={this.onTypeaheadChange}
            value={value}
            creatable={creatable}
            disableOptionClearable={disableOptionClearable}
            multi
            {...otherProps}
          />
        )}
        {showEffects && (
          <div className="tagList__list">
            {value &&
              value.map((itemValue, index) => (
                <EffectItem
                  data={itemValue}
                  readOnly={readOnly}
                  key={generate()}
                  onRemove={() => this.onEffectRemove(index)}
                  onChange={val => this.onEffectChange(index, val)}
                />
              ))}
          </div>
        )}
      </div>
    );
  }
}

export { TagItem };

export default TagList;
