// @flow
import * as React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  role: string,
};

const UserRoleBadge = ({ role }: Props) => (
  <div className={cx('userRoleBadge', `userRoleBadge--${role}`)}>{role}</div>
);

export default UserRoleBadge;
