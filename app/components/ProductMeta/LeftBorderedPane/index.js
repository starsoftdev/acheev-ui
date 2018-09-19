// @flow

import * as React from 'react';
import cx from 'classnames';
import './styles.scss';
type Props = {
  children?: any,
  className?: string,
};
const LeftBorderedPane = ({ children, className }: Props) => (
  <div className={cx('leftBorderedPane', className)}>{children}</div>
);

export default LeftBorderedPane;
