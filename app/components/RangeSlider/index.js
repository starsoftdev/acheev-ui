// @flow

import * as React from 'react';
import Slider, { Handle, Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import cx from 'classnames';

import './styles.scss';

type Props = {
  minValue?: number,
  maxValue?: number,
  step?: number,
  value?: number,
  className?: string,
  withTwoHandles?: boolean,
  withRowClass?: boolean,
};

const CustomHandle = ({
  value,
  dragging,
  index,
  ...restProps
}: CustomHandleProps) => (
  <Tooltip
    prefixCls="rangeSlider__tooltip rc-slider-tooltip"
    overlay={value}
    visible
    placement="bottom"
    key={index}
  >
    <Handle value={value} {...restProps} />
  </Tooltip>
);

type CustomHandleProps = {
  value: number,
  dragging: boolean,
  index: number,
};

const RangeHandle = ({
  value,
  index,
  dragging,
  ...restProps
}: CustomHandleProps) => (
  <Tooltip
    prefixCls="rc-slider-tooltip-range"
    overlay={value}
    placement={index ? 'right' : 'left'}
    key={index}
    visible
  >
    <Handle value={value} {...restProps} />
  </Tooltip>
);

const RangeSlider = ({
  minValue = 0,
  maxValue = 10,
  value = 0,
  step = 1,
  className,
  withTwoHandles,
  withRowClass = true,
  ...otherProps
}: Props) => {
  const mergedClassName = cx('rangeSlider align-middle', className, {
    row: withRowClass,
    'rangeSlider--withTwoHandles': withTwoHandles,
    'rangeSlider--withOneHandle': !withTwoHandles,
  });

  const Component = withTwoHandles ? Range : Slider;

  return (
    <div className={mergedClassName}>
      <div className="column small-12">
        <Component
          min={minValue}
          max={maxValue}
          defaultValue={value}
          value={value}
          step={step}
          handle={withTwoHandles ? RangeHandle : CustomHandle}
          {...otherProps}
        />
      </div>
      <div className="column small-12 rangeSlider__labels">
        {!withTwoHandles && <div>{minValue}</div>}
        {!withTwoHandles && <div>{maxValue}</div>}
      </div>
    </div>
  );
};

export default RangeSlider;
