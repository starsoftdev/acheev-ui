// @flow

import * as React from 'react';
import cx from 'classnames';

import Icon from 'components/Icon';

import './styles.scss';

type Props = {
  className: string,
  title: string,
  completed: boolean,
  glyph: string,
};

const ProfileCompletionItem = ({
  className,
  title,
  completed,
  glyph,
}: Props) => (
  <div className={cx('profileCompletionItem', className)}>
    <div
      className={cx('profileCompletionItem__icon', {
        'profileCompletionItem__icon--completed': completed,
      })}
    >
      <Icon glyph={glyph} size={14} />
    </div>
    <div className="profileCompletionItem__title">{title}</div>
  </div>
);

export default ProfileCompletionItem;
