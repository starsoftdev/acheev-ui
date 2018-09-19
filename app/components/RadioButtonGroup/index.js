// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';

import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';

type Props = {
  className?: string,
  options: Array<Object>,
  onChange?: Function,
  selectedButton?: string,
};

class RadioButtonGroup extends Component<
  Props,
  {
    selectedButton: any,
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedButton: null,
    };
  }
  componentWillMount() {
    const { selectedButton } = this.props;
    if (selectedButton) {
      this.setState({ selectedButton });
    }
  }
  render() {
    const { className, options, onChange } = this.props;
    return (
      <div className="radioButtonGroup">
        <ButtonGroup className={className}>
          {options &&
            options.map(({ value, label }) => {
              const { selectedButton } = this.state;
              const isSelected =
                value === selectedButton || label === selectedButton;
              const buttonClassName = cx(
                'medium-semiSpacious',
                isSelected ? 'dark' : 'light hollow'
              );
              return (
                <Button
                  className={buttonClassName}
                  onClick={() => {
                    this.setState({ selectedButton: value });
                    if (onChange) onChange(value);
                  }}
                  key={generate()}
                >
                  {label}
                </Button>
              );
            })}
        </ButtonGroup>
      </div>
    );
  }
}

export default RadioButtonGroup;
