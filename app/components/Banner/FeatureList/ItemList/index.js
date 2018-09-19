// @flow

import * as React from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import type { List, Map } from 'immutable';

import Icon from 'components/Icon';

import './styles.scss';

type Props = {
  data: List<Map<*, *>>,
  className?: string,
};

const FeatureList = ({ data, className }: Props) => {
  const mergedClassName = cx('itemList row align-spaced', className);
  return (
    <div className={mergedClassName}>
      {data.map(item => (
        <div
          className="itemList__item column medium-4 small-12 mb-mx"
          key={generate()}
        >
          <Icon glyph={item.get('icon', '')} size={70} className="mb-sm" />
          <div className="itemList__title">{item.get('title', '')}</div>
          <div className="itemList__subTitle">{item.get('subTitle', '')}</div>
        </div>
      ))}
    </div>
  );
};

export default FeatureList;
