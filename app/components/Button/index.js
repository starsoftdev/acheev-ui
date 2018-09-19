// @flow

import * as React from 'react';
import cx from 'classnames';

import Spinner from 'components/Spinner';
import Link from 'components/Link';

import './styles.scss';

type Props = {
  element?: any,
  className?: string,
  children?: any,
  onClick?: Function,
  to?: string,
  type?: string,
  activeClassName?: string,
  disabled?: boolean,
  isLoading?: boolean,
  exact?: boolean,
};

const Button = (props: Props) => {
  const {
    className,
    element = 'a',
    children,
    onClick,
    to,
    type,
    activeClassName,
    disabled,
    isLoading,
    exact,
  } = props;
  const mergedClassName = cx('button', className);
  const actualProps: Object = {
    className: mergedClassName,
    onClick,
    to,
    disabled: disabled || isLoading,
  };
  if (activeClassName) actualProps.activeClassName = activeClassName;
  if (element === 'button') actualProps.type = type;
  if (element === Link && exact) actualProps.exact = exact;
  return React.createElement(
    type ? 'button' : element,
    actualProps,
    <div className="row align-middle align-center">
      {isLoading && (
        <div className="shrink column">
          <Spinner className="button__spinner" />
        </div>
      )}
      <div className="shrink column">{[children]}</div>
    </div>
  );
};

export default Button;
