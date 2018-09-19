// @flow

import * as React from 'react';
import type { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { getIn } from 'utils/immutable';

import Preloader from 'components/Preloader';
import Banner from 'components/Cannabis101/Banner';
import Chapters from 'components/Cannabis101/Chapters';
import Article from './Article';
import Chapter from './Chapter';

type Props = {
  isLoading: boolean,
  chapters: List<Map<*, *>>,
  match: Object,
  currentChapterIndex: number,
};

class Cannabis101ChapterPage extends React.Component<Props> {
  render() {
    const { chapters, isLoading, match, currentChapterIndex } = this.props;
    const articleSlug = match.params.article;
    const chapter =
      chapters &&
      chapters.find(i => getIn(i, ['fields', 'slug']) === match.params.chapter);
    const articles = getIn(chapter, ['fields', 'articles']);
    const currentArticleIndex =
      articles &&
      articles.findIndex(i => getIn(i, ['fields', 'slug']) === articleSlug);
    const article =
      articles &&
      articles.find(i => getIn(i, ['fields', 'slug']) === articleSlug);

    return isLoading ? (
      <Preloader />
    ) : (
      <div className="row column c101page">
        {chapter && (
          <div className="mb-hg">
            <Banner
              title={getIn(chapter, ['fields', 'title'])}
              image={getIn(chapter, [
                'fields',
                'bannerImage',
                'fields',
                'file',
                'url',
              ])}
            />
            {articleSlug ? (
              <Article
                data={article}
                currentArticleIndex={currentArticleIndex}
                currentChapterIndex={currentChapterIndex}
              />
            ) : (
              <Chapter chapter={chapter} />
            )}
          </div>
        )}
        <Chapters
          data={chapters}
          url={match.url}
          currentChapterIndex={currentChapterIndex}
          currentArticleIndex={currentArticleIndex}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['c101', 'chapters', 'isLoading']),
  chapters: state.getIn(['c101', 'chapters', 'data']),
});

export default connect(mapStateToProps)(Cannabis101ChapterPage);
