// @flow

import React, { Component } from 'react';

import Icon from 'components/Icon';

import ChevronDown from 'images/sprite/chevron-down.svg';

type Props = {
  onClick?: Function,
  value?: any,
  before: string,
};

export default class CustomInput extends Component<Props> {
  render() {
    const { onClick, value, before } = this.props;
    return (
      <button className="dateRangePicker__customInput" onClick={onClick}>
        <div className="row align-middle">
          <div className="shrink column npr">{before}&nbsp;</div>
          <div className="dateRangePicker__customInputValue shrink column np">
            {value}&nbsp;
          </div>
          <div className="dateRangePicker__customInputValue shrink column np">
            <Icon glyph={ChevronDown} size={12} />
          </div>
        </div>
      </button>
    );
  }
}
