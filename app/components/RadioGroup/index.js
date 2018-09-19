// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import './styles.scss';

type Props = {
  name: string,
  options: Array<Object>,
  className?: string,
  itemClassName?: string,
  onChange: Function,
  value?: any,
};

class RadioGroup extends Component<
  Props,
  {
    selectedOption: any,
  }
> {
  constructor(props: Props) {
    super();
    this.state = {
      selectedOption:
        props.value !== null ? props.value : props.options[0].value,
    };
  }
  render() {
    const { className, itemClassName, options, onChange, name } = this.props;
    return (
      <div className="radioGroup">
        <div className={className}>
          {options &&
            options.map(item => {
              const radioClassName = cx('radioGroup__item', itemClassName);
              return (
                <div className={radioClassName} key={generate()}>
                  <input
                    type="radio"
                    className="radioGroup__option"
                    name={name}
                    value={item.value}
                    onClick={() => {
                      this.setState({ selectedOption: item.value });
                      onChange(item.value);
                    }}
                    defaultChecked={item.value === this.state.selectedOption}
                  />{' '}
                  {item.label}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default RadioGroup;
