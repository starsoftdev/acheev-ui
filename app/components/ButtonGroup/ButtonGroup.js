// @flow

import * as React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  className?: string,
  children?: React.Element<any>,
};

const ButtonGroup = ({ className, children }: Props) => {
  const mergedClassName = cx('button-group', className);
  return <div className={mergedClassName}>{children}</div>;
};

export default ButtonGroup;
