// @flow

import React, { Fragment } from 'react';
import type { Map } from 'immutable';
import { getIn } from 'utils/immutable';
import readingTime from 'reading-time';
import marked from 'utils/marked';

import './styles.scss';

type Props = {
  chapter: Map<*, *>,
};

export default class Cannabis101ChapterPage extends React.Component<Props> {
  render() {
    const { chapter } = this.props;
    const articles = getIn(chapter, ['fields', 'articles']);
    const wholeText =
      articles &&
      articles.reduce(
        (accumulator, value) =>
          accumulator + getIn(value, ['fields', 'content']),
        ''
      );
    const stats = wholeText && readingTime(wholeText);

    return (
      <Fragment>
        <div className="c101__minRead">{stats.text}</div>
        <h2>Summary of chapter</h2>
        <div
          className="c101chapter__summary contentful"
          dangerouslySetInnerHTML={{
            __html: marked(getIn(chapter, ['fields', 'summary'])),
          }}
        />
      </Fragment>
    );
  }
}
