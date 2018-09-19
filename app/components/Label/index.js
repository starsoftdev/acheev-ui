// @flow

import * as React from 'react';
import cx from 'classnames';

import Link from 'components/Link';

import './styles.scss';

type Props = {
  className?: string,
  hasArrow?: boolean,
  children?: any,
  linksTo?: string,
};

const Label = ({
  className,
  children,
  hasArrow,
  linksTo,
  ...otherProps
}: Props) => {
  const mergedClassName = cx(
    'label',
    className,
    hasArrow ? 'label--hasArrow' : ''
  );
  const actualProps: Object = otherProps;
  if (linksTo) actualProps.to = linksTo;
  return React.createElement(
    linksTo ? Link : 'div',
    {
      className: mergedClassName,
      ...actualProps,
    },
    children
  );
};

export default Label;
