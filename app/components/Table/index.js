// @flow

import * as React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  className?: string,
  children?: any,
};

const Table = (props: Props) => {
  const { className, children } = props;
  const mergedClassName = cx('table', className);
  return <table className={mergedClassName}>{children}</table>;
};

export default Table;
