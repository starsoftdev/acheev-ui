// @flow

import React, { Component } from 'react';

// Styles for this component are in `/styles/components/input.scss` in order for custom inputs like react-formal's `Field` to be styled properly.

type Props = {
  element?: string,
  type?: string,
  onChange?: Function,
  autoFocus?: boolean,
  instance?: Function,
};

class Input extends Component<Props> {
  componentDidMount() {
    if (this.props.autoFocus && window.screen.width > 500) {
      this.inputElement.focus();
    }
  }

  inputElement: HTMLElement;
  render() {
    const {
      element = 'input',
      type = 'text',
      onChange,
      instance,
      ...otherProps
    } = this.props;
    return React.createElement(element, {
      type,
      onChange: e => {
        if (onChange) onChange(e.target.value);
      },
      ref: input => {
        this.inputElement = input;
        if (instance) instance(input);
      },
      ...otherProps,
    });
  }
}

export default Input;
