// @flow

import React from 'react';
import { NavHashLink, HashLink } from 'react-router-hash-link';
import cx from 'classnames';

type Props = {
  to?: string,
  children?: any,
  className?: string,
  activeClassName?: string,
  exact?: boolean,
  pathname?: string,
};

class CustomLink extends React.Component<Props> {
  render() {
    const {
      to,
      className,
      activeClassName,
      children,
      exact = false,
      pathname,
      ...otherProps
    } = this.props;
    const regex = new RegExp('^http', 'i');
    const isExternal = to ? regex.test(to) : false;
    const isNested = to && to.split('/').filter(x => x).length > 1;
    const actualProps: Object = {
      className: cx(
        className,
        isNested && pathname && to && pathname.startsWith(to) && activeClassName
      ),
      to,
      ...otherProps,
    };
    let Component = HashLink;

    if (isExternal || !to) {
      Component = 'a';
    } else if (activeClassName) {
      Component = NavHashLink;
    }

    if (isExternal) {
      actualProps.href = to;
    } else {
      actualProps.to = to;
      if (Component === NavHashLink) {
        actualProps.activeClassName = activeClassName;
        actualProps.exact = exact;
      }
    }
    return React.createElement(Component, actualProps, [children]);
  }
}

export default CustomLink;
