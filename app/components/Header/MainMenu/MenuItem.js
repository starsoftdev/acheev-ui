// @flow

import * as React from 'react';
import Link from 'components/Link';
import cx from 'classnames';
import { connect } from 'react-redux';

import { closeNavbar as closeNavbarAction } from 'containers/App/sagas';

type Props = {
  text: string,
  link: string,
  hasChildren?: boolean,
  className?: string,
  linkClassName?: string,
  containerClassName?: boolean,
  closeNavbar: Function,
  exact: boolean,
  pathname?: string,
};

const MenuItem = ({
  text,
  link,
  hasChildren,
  containerClassName = true,
  className,
  linkClassName,
  closeNavbar,
  exact,
  pathname,
  ...otherProps
}: Props) => {
  const mergedClassName = cx({ mainMenu__item: containerClassName }, className);
  const mergedLinkClassName = cx('mainMenu__link', linkClassName);
  return (
    <div className={mergedClassName} {...otherProps}>
      {link ? (
        <Link
          className={mergedLinkClassName}
          activeClassName="mainMenu__link--active"
          to={link}
          onClick={() => closeNavbar()}
          pathname={pathname}
          exact={exact}
        >
          {text}
        </Link>
      ) : (
        <span className="mainMenu__link mainMenu__link--hasChildren mainMenu__link--topLevel">
          {text}
        </span>
      )}
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  closeNavbar: () => dispatch(closeNavbarAction()),
});

export default connect(null, mapDispatchToProps)(MenuItem);
