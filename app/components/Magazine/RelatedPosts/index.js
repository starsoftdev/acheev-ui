// @flow

import * as React from 'react';
import type { List, Map } from 'immutable';

import Post from 'components/Magazine/PostList/Item';

import './styles.scss';

type Props = {
  data: List<Map<string, *>>,
  showItemsNumber?: number,
  pathname: string,
};

const RelatedPosts = ({ data, showItemsNumber = 3, pathname }: Props) => {
  if (!data || !data.size) {
    return null;
  }
  return (
    <div className="relatedPosts row column">
      <h3 className="relatedPosts__title">Latest stories</h3>
      <div className="row">
        {data.entrySeq().map(([key, item]) => {
          if (key > showItemsNumber - 1) return null;
          return (
            <div className="small-12 medium-4 column" key={key}>
              <Post data={item} index={key} pathname={pathname} small />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedPosts;
