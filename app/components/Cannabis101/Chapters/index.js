// @flow

import React from 'react';
import type { List, Map } from 'immutable';
import { getIn } from 'utils/immutable';
import InternalLinks from 'enum/InternalLinks';

import Link from 'components/Link';

import './styles.scss';

type Props = {
  currentChapterIndex?: number,
  currentArticleIndex?: number,
  data: List<Map<*, *>>,
};

const Canabis101Chapters = ({
  data,
  currentChapterIndex = -1,
  currentArticleIndex = -1,
}: Props) => {
  if (!data) return null;
  const nextArticleIndex = currentArticleIndex + 1;
  const nextChapterIndex = currentChapterIndex + 1;
  const nextArticle = getIn(data, [
    currentChapterIndex,
    'fields',
    'articles',
    nextArticleIndex,
  ]);
  const nextChapter = getIn(data, [currentChapterIndex + 1]);
  const currentChapterSlug = getIn(data, [
    currentChapterIndex,
    'fields',
    'slug',
  ]);
  const nextChapterSlug = getIn(data, [nextChapterIndex, 'fields', 'slug']);
  const isInCurrentChapter =
    currentChapterIndex !== -1 &&
    nextArticleIndex <
      getIn(data, [currentChapterIndex, 'fields', 'articles']).size;
  return (
    <div className="c101chapters">
      {isInCurrentChapter ? (
        <div className="c101chapters__panel">
          <Link
            className="c101chapters__nextArticleLink plain-link"
            to={`/${InternalLinks.CANNABIS_101}/${currentChapterSlug}/${getIn(nextArticle, [
              'fields',
              'slug',
            ])}`}
          >
            {currentChapterIndex + 1}.{nextArticleIndex + 1}{' '}
            {getIn(nextArticle, ['fields', 'title'])} &rarr;
          </Link>
        </div>
      ) : (
        nextChapterIndex < data.size && (
          <div className="c101chapters__panel">
            <Link
              className="c101chapters__nextArticleLink plain-link"
              to={`/${InternalLinks.CANNABIS_101}/${nextChapterSlug}`}
            >
              {nextChapterIndex + 1}.0 {getIn(nextChapter, ['fields', 'title'])}{' '}
              &rarr;
            </Link>
          </div>
        )
      )}
      <div className="row">
        {data.map((item, i) => (
          <div
            className="small-12 medium-6 large-4 column mb-mx"
            key={getIn(item, ['sys', 'id'])}
          >
            <div
              className="c101chapters__image"
              style={{
                backgroundImage: `url(${getIn(item, [
                  'fields',
                  'chapterImage',
                  'fields',
                  'file',
                  'url',
                ]) ||
                  getIn(item, [
                    'fields',
                    'bannerImage',
                    'fields',
                    'file',
                    'url',
                  ])})`,
              }}
            />
            <Link
              to={`/${InternalLinks.CANNABIS_101}/${getIn(item, ['fields', 'slug'])}`}
              className="c101chapters__title plain-link"
            >
              {i + 1}.0 {getIn(item, ['fields', 'title'])} &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Canabis101Chapters;
