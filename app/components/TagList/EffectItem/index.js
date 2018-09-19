// @flow

import React, { Component } from 'react';
import cx from 'classnames';

import Icon from 'components/Icon';
import IconClose from 'images/sprite/close-gray.svg';
import RangeSlider from 'components/RangeSlider';
import ProgressBar from 'components/ProgressBar';

import './styles.scss';

type Props = {
  data: Object,
  readOnly?: boolean,
  className?: string,
  onChange?: Function,
  onRemove?: Function,
};

type State = {
  value: number,
};

class EffectItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { data } = this.props;
    const value = data && data.strength !== undefined ? data.strength : 5;

    this.state = { value };
  }

  handleAfterChange = (value: number) => {
    const { onChange } = this.props;
    if (onChange) onChange(value);
  };

  handleChange = (value: number) => {
    this.setState({ value });
  };

  render() {
    const { data, readOnly = false, onRemove, className } = this.props;
    const mergedClassName = cx('effectItem', className);
    if (!data) return null;
    return (
      <div className={mergedClassName}>
        <div className="row align-middle">
          <div className="column small-12">
            {readOnly === false && (
              <Icon
                glyph={IconClose}
                size={12}
                className="effectItem__close mr-sm"
                onClick={onRemove}
              />
            )}
            <div className="effectItem__title">{data.name || data.label}</div>
          </div>
          <div className="column small-12">
            {readOnly === true ? (
              <ProgressBar value={data.strength || data.value} maxValue={10} />
            ) : (
              <RangeSlider
                value={this.state.value}
                maxValue={10}
                onAfterChange={this.handleAfterChange}
                onChange={this.handleChange}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default EffectItem;
