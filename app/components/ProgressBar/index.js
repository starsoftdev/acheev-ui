// @flow

import * as React from 'react';
import { Line } from 'react-progress-bar.js';
import cx from 'classnames';

import './styles.scss';

type Props = {
  value: number,
  maxValue?: number,
  className?: string,
  progressBarClassName?: string,
  color?: string,
  trailColor?: string,
  width?: number,
  trailWidth?: number,
  initialAnimate?: boolean,
  showValue?: boolean,
  valuePostfix?: string,
  rounded?: boolean,
  fullWidth?: boolean,
};

const ProgressBarComponent = ({
  value = 0,
  maxValue = 1,
  className,
  progressBarClassName,
  trailColor = '#f0f2f7',
  color = '#11b4e4',
  width = 2,
  trailWidth = width,
  initialAnimate = true,
  showValue,
  valuePostfix,
  rounded = true,
  fullWidth = false,
}: Props) => {
  const options = {
    strokeWidth: width,
    color,
    width,
    trailColor,
    trailWidth,
  };
  const progressValue = parseFloat(value) / parseFloat(maxValue);
  return (
    <div
      className={cx('progressBar row align-middle', className, {
        'progressBar--rounded': rounded,
        'progressBar--fullWidth': fullWidth,
      })}
    >
      <div className={cx('column', progressBarClassName)}>
        <Line
          progress={progressValue}
          options={options}
          initialAnimate={initialAnimate}
          containerStyle={{ height: width }}
          containerClassName="progressBar__line"
        />
      </div>
      {showValue && (
        <div className="progressBar__value shrink column">
          {value}
          {valuePostfix}
        </div>
      )}
    </div>
  );
};

export default ProgressBarComponent;
