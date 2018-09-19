// @flow

import * as React from 'react';
import cx from 'classnames';
import type { Map } from 'immutable';

import Button from 'components/Button';
import Link from 'components/Link';

import './styles.scss';

type Props = {
  data: Map<string, *>,
  className?: string,
};

const ContributorsListItem = ({ data, className }: Props) => {
  if (!data) {
    return null;
  }
  const mergedClassName = cx('contributorsListItem', className);
  return (
    <div className={mergedClassName}>
      <div
        className="contributorsListItem__avatar"
        style={{
          backgroundImage: `url(${data.getIn(
            ['fields', 'profilePhoto', 'fields', 'file', 'url'],
            ''
          )})`,
        }}
      />
      <div className="contributorsListItem__name">
        {data.getIn(['fields', 'name'])}
      </div>
      <p className="mb-md">{data.getIn(['fields', 'biography'])}</p>
      <div className="text-center">
        <Button
          element={Link}
          className="expanded tiny secondary"
          to={`/magazine/contributors/${data.getIn(['fields', 'slug'], '')}/`}
        >
          see all articles by {data.getIn(['fields', 'name'])}
        </Button>
      </div>
    </div>
  );
};

export default ContributorsListItem;
