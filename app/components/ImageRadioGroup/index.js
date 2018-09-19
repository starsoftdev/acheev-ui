// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import Icon from 'components/Icon';
import './styles.scss';

type Props = {
  options: Array<Object>,
  className?: string,
  itemClassName?: string,
  onChange: Function,
  value?: any,
};

class ImageRadioGroup extends Component<
  Props,
  {
    selectedOption: any,
  }
> {
  constructor(props: Props) {
    super();
    this.state = {
      selectedOption: props.value,
    };
  }

  handleClickItem = (item: Object) => {
    const { selectedOption } = this.state;
    let itemValue = item.value;
    if (selectedOption === itemValue) {
      itemValue = null;
    }
    this.setState({ selectedOption: itemValue });
    this.props.onChange(itemValue);
  };

  render() {
    const { className, itemClassName, options } = this.props;
    const { selectedOption } = this.state;
    const mergedClassName = cx('imageRadioGroup', className);
    return (
      <div className={mergedClassName}>
        {options.map(item => {
          let icon;
          if (item.value === selectedOption) {
            icon = item.activeIcon || item.icon;
          } else {
            icon = item.icon;
          }
          return (
            <div
              className={itemClassName}
              key={generate()}
              onClick={() => this.handleClickItem(item)}
              role="button"
            >
              <div
                className={cx('imageRadioGroup__item', {
                  'imageRadioGroup__item--active':
                    item.value === selectedOption,
                })}
              >
                <div className="imageRadioGroup__icon">
                  <Icon glyph={icon} size={34} />
                </div>
                <div className="imageRadioGroup__label">{item.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ImageRadioGroup;
