// @flow

import React, { Component } from 'react';
import type { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { get, getIn } from 'utils/immutable';
import moment from 'moment';

import InternalLinks from 'enum/InternalLinks';

import Preloader from 'components/Preloader';
import Link from 'components/Link';
import PostList from 'components/Magazine/PostList';

type Props = {
  posts: List<Map<string, *>>,
  isLoading: boolean,
};

const postsNum = 6;

class MagazinePage extends Component<Props> {
  render() {
    const { posts, isLoading } = this.props;
    const featuredPosts =
      posts &&
      posts.filter(i => getIn(i, ['fields', 'featured'])).take(postsNum);
    const firstFeaturedPost = featuredPosts && get(featuredPosts.take(1), 0);
    const restFeaturedPosts =
      featuredPosts && featuredPosts.takeLast(postsNum - 1);
    const postLink = `/${InternalLinks.MAGAZINE}/${getIn(firstFeaturedPost, [
      'fields',
      'slug',
    ])}`;

    return isLoading ? (
      <Preloader />
    ) : (
      <div className="magazineHome magazineBody magazineBody--sm">
        <div className="magazineHome__featuredArticles row">
          <div className="small-12 medium-6 large-7 column mb-xl">
            <Link
              className="magazineHome__image"
              to={postLink}
              style={{
                backgroundImage: `url(${getIn(firstFeaturedPost, [
                  'fields',
                  'featuredImage',
                  'fields',
                  'file',
                  'url',
                ])})`,
              }}
            />
            <h5>
              <Link
                className="magazineHome__link magazineHome__link--category plain-link"
                to={`/${InternalLinks.MAGAZINE_CATEGORY}/${getIn(firstFeaturedPost, [
                  'fields',
                  'category',
                  0,
                  'fields',
                  'slug',
                ])}`}
              >
                {getIn(firstFeaturedPost, [
                  'fields',
                  'category',
                  0,
                  'fields',
                  'title',
                ])}
              </Link>
            </h5>
            <h2>
              <Link className="magazineHome__link plain-link" to={postLink}>
                {getIn(firstFeaturedPost, ['fields', 'title'])}
              </Link>
            </h2>
            <h6>
              {moment(getIn(firstFeaturedPost, ['sys', 'createdAt'])).format(
                'll'
              )}
            </h6>
          </div>
          <div className="small-12 medium-6 large-5 column mb-xl">
            {restFeaturedPosts &&
              restFeaturedPosts.map(i => (
                <h4
                  className="magazineHome__featuredTitle"
                  key={getIn(i, ['sys', 'id'])}
                >
                  <Link
                    className="magazineHome__link plain-link"
                    to={`/${InternalLinks.MAGAZINE}/${getIn(i, ['fields', 'slug'])}`}
                  >
                    {getIn(i, ['fields', 'title'])}
                  </Link>
                </h4>
              ))}
          </div>
        </div>
        <div className="row column">
          <h2 className="mb-lg">Latest Stories</h2>
        </div>
        <PostList data={posts} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.getIn(['magazine', 'posts', 'response', 'items']),
  isLoading: state.getIn(['magazine', 'posts', 'isLoading']),
});

export default connect(mapStateToProps)(MagazinePage);
