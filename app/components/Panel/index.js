// @flow

import * as React from 'react';
import cx from 'classnames';
import './styles.scss';

type Props = {
  children?: any,
  className?: string,
  theme?: string,
};

const Panel = ({ children, className, theme }: Props) => {
  const mergedClassName = cx('panel', `panel--${theme || 'light'}`, className);
  return <div className={mergedClassName}>{children}</div>;
};

export default Panel;
