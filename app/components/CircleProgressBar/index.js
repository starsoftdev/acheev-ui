// @flow

import * as React from 'react';
import cx from 'classnames';
import ProgressBar from 'react-progress-bar.js';

import './styles.scss';

type Props = {
  radius: number,
  className?: string,
};
const CircleProgressBar = ({ radius, className, ...otherProps }: Props) => {
  const containerStyle = {
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
  };
  return (
    <ProgressBar.Circle
      containerStyle={containerStyle}
      containerClassName={cx('circleProgressBar', className)}
      {...otherProps}
    />
  );
};

export default CircleProgressBar;
