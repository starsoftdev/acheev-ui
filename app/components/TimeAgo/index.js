// @flow

import * as React from 'react';
import moment from 'moment';
import cx from 'classnames';

import Icon from 'components/Icon';

import ClockIncon from 'images/sprite/clock.svg';
import './styles.scss';

type Props = {
  data?: string,
  title?: string,
  prefix?: string,
  className?: string,
};

const TimeAgo = ({ data, title, prefix, className }: Props) => {
  const fromNow = moment(data).fromNow();
  const mergedClassName = cx('timeAgo f-secondary', className);
  return (
    <div className={mergedClassName} title={title}>
      <Icon className="mr-tn" glyph={ClockIncon} size={15} />
      {`${String(prefix)} ${fromNow}`}
    </div>
  );
};

TimeAgo.defaultProps = {
  prefix: '',
};

export default TimeAgo;
