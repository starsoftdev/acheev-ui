// @flow

import * as React from 'react';
import cx from 'classnames';

import Button from 'components/Button';

type Props = {
  active?: boolean,
  onClick?: Function,
  children: React.Element<any>,
  className?: string,
};

const ButtonGroupItem = ({ active, onClick, children, className }: Props) => {
  const mergedClassName = cx(active ? 'active' : 'light hollow', className);
  return (
    <Button element="button" className={mergedClassName} onClick={onClick}>
      {children}
    </Button>
  );
};

export default ButtonGroupItem;
