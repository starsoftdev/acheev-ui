// @flow

import * as React from 'react';
import cx from 'classnames';
import './styles.scss';
type Props = {
  title: string,
  className?: string,
  data: Map<string, string>,
};
const ConditionPane = ({ title, className, data }: Props) => (
  <div className={cx('conditionPane', className)}>
    <div className="conditionPane__title">{title}</div>
    {data && data.size > 0 ? (
      <ul className="conditionPane__condition">
        {data.entrySeq().map(([key, value]) => (
          <li key={key} className="conditionPane__conditionItem">
            {value}
          </li>
        ))}
      </ul>
    ) : (
      'No data available'
    )}
  </div>
);

export default ConditionPane;
