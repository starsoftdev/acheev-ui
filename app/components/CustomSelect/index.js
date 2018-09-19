// @flow

import React, { Component } from 'react';
import Select, { Creatable } from 'react-select';
import cx from 'classnames';
import { sortBy } from 'lodash-es';

import transformOptions from 'utils/transformOptions';

import Icon from 'components/Icon';
import ChevronDown from 'images/sprite/chevron-down.svg';
import ChevronUp from 'images/sprite/chevron-up.svg';

import './styles/default.scss';

type Props = {
  splitLabel?: string,
  options?: Array<string> | Array<{ value: string, label: string }>,
  className?: string,
  creatable?: boolean,
  clearableValue?: boolean,
  searchable?: boolean,
  meta?: Array<string>,
  onChange?: Function,
  onClose?: Function,
  onOpen?: Function,
  arrowRenderer?: Function,
  sortAlphabetically?: boolean,
};

class CustomSelect extends Component<
  Props,
  {
    isToggled: boolean,
  }
> {
  static defaultProps = {
    searchable: false,
    sortAlphabetically: true,
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      isToggled: false,
    };
  }

  onChangeHandler = (val: string) => {
    const { onChange, meta } = this.props;
    if (onChange) onChange(val, meta);
  };

  onOpen = () => {
    this.setState({ isToggled: true });
  };

  onClose = () => {
    this.setState({ isToggled: false });
  };

  arrowRenderer = () => (
    <Icon glyph={this.state.isToggled ? ChevronUp : ChevronDown} size={10} />
  );

  render() {
    const {
      splitLabel,
      options,
      className,
      sortAlphabetically,
      creatable,
      clearableValue = true,
      arrowRenderer,
      onChange,
      onOpen,
      onClose,
      ...otherProps
    } = this.props;

    const containerClassName = cx('reactSelect', className, {
      'reactSelect--hasSplitLabel': splitLabel,
    });

    let transformedOptions = transformOptions(options);

    if (clearableValue === false) {
      transformedOptions = transformedOptions.map(item => {
        const newItem = item;
        newItem.clearableValue = false;
        return item;
      });
    }

    return (
      <div className={containerClassName}>
        {splitLabel && (
          <div className="reactSelect__splitLabel">{splitLabel}</div>
        )}
        {React.createElement(creatable ? Creatable : Select, {
          arrowRenderer: arrowRenderer || this.arrowRenderer,
          options: sortAlphabetically
            ? sortBy(transformedOptions, 'label')
            : transformedOptions,
          onChange: this.onChangeHandler,
          onOpen: this.onOpen,
          onClose: this.onClose,
          ...otherProps,
        })}
      </div>
    );
  }
}

export default CustomSelect;
