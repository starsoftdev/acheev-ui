// @flow

import React, { Fragment } from 'react';
import type { Map } from 'immutable';
import { getIn } from 'utils/immutable';
import marked from 'utils/marked';
import readingTime from 'reading-time';

type Props = {
  data: Map<*, *>,
  currentArticleIndex: number,
  currentChapterIndex: number,
};

export default class Cannabis101ArticlePage extends React.Component<Props> {
  render() {
    const { data, currentChapterIndex, currentArticleIndex } = this.props;
    const content = getIn(data, ['fields', 'content']);
    const stats = content && readingTime(content);

    return (
      <Fragment>
        <div className="c101__minRead">{stats.text}</div>
        <h2 id={getIn(data, ['fields', 'slug'])}>
          {currentChapterIndex + 1}.{currentArticleIndex + 1}{' '}
          {getIn(data, ['fields', 'title'])}
        </h2>
        <div
          className="contentful"
          dangerouslySetInnerHTML={{
            __html: marked(content),
          }}
        />
      </Fragment>
    );
  }
}
