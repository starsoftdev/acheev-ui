// @flow

import * as React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  className?: string,
  centered?: boolean,
  leftAligned?: boolean,
  element?: string,
  children?: React.Node,
};

const BorderedTitle = (props: Props) => {
  const { className, centered, leftAligned, element = 'h2', children } = props;
  const mergedClassName = cx('borderedTitle', className, {
    'borderedTitle--centered': centered,
    'borderedTitle--leftAligned': leftAligned,
  });
  return React.createElement(
    element,
    {
      className: mergedClassName,
    },
    [children]
  );
};

export default BorderedTitle;
