// @flow

import * as React from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import { List } from 'immutable';
import CannabisAwardItem from './CannabisAwardItem';

import './styles.scss';

type Props = {
  className?: string,
  title?: string,
  data: List<Object>,
};

const CannabisAwards = ({
  className,
  title = 'Canadian Cannabis Awards',
  data,
}: Props) => {
  if (!data || data.size === 0) return null;
  const mergedClassName = cx(className, 'cannabisAwards');
  return (
    <div className={mergedClassName}>
      <div className="cannabisAwards__title">{title}</div>
      <div className="row align-center">
        {data.valueSeq().map(item => (
          <div
            className="column text-center small-12 medium-3 mb-sm"
            key={generate()}
          >
            <CannabisAwardItem data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CannabisAwards;
