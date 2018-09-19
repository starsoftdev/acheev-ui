// @flow

import * as React from 'react';
import cx from 'classnames';
import type { Map } from 'immutable';
import moment from 'moment';
import { getIn } from 'utils/immutable';

import InternalLinks from 'enum/InternalLinks';

import Link from 'components/Link';

import './styles.scss';

type Props = {
  data: Map<string, *>,
  className?: string,
  small?: boolean,
};

const PostListItem = ({ data, className, small }: Props) => {
  if (!data) {
    return null;
  }
  const mergedClassName = cx('postListItem', { small }, className);
  const postLink = `/${InternalLinks.MAGAZINE}/${getIn(data, ['fields', 'slug'])}`;
  return (
    <div className={mergedClassName}>
      <Link
        className="postListItem__image"
        to={postLink}
        style={{
          backgroundImage: `url(${getIn(data, [
            'fields',
            'featuredImage',
            'fields',
            'file',
            'url',
          ])})`,
        }}
      />
      <h5 className="postListItem__category">
        <Link
          className="postListItem__link postListItem__link--category plain-link"
          to={`/${InternalLinks.MAGAZINE_CATEGORY}/${getIn(data, [
            'fields',
            'category',
            0,
            'fields',
            'slug',
          ])}`}
        >
          {getIn(data, ['fields', 'category', 0, 'fields', 'title'])}
        </Link>
      </h5>
      <h4 className="postListItem__title f-primary">
        <Link className="postListItem__link plain-link" to={postLink}>
          <strong>{getIn(data, ['fields', 'title'])}</strong>
        </Link>
      </h4>
      <div className="postListItem__date">
        {moment(getIn(data, ['fields', 'date'])).format('ll')}
      </div>
    </div>
  );
};

export default PostListItem;
