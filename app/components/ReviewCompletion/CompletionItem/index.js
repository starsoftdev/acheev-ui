// @flow

import * as React from 'react';
import cx from 'classnames';

import Icon from 'components/Icon';

import IconCorrect from 'images/sprite/correct-symbol-gray.svg';
import IconCorrectCompleted from 'images/sprite/correct-symbol-green.svg';

import './styles.scss';

type Props = {
  className?: string,
  title: string,
  completed: boolean,
};

const ProfileCompletionItem = ({ className, title, completed }: Props) => (
  <div className={cx('completionItem', className)}>
    <Icon glyph={completed ? IconCorrectCompleted : IconCorrect} size={12} />
    <div className="completionItem__title">{title}</div>
  </div>
);

export default ProfileCompletionItem;
