// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import type { List, Map } from 'immutable';
import marked from 'utils/marked';
import { getIn } from 'utils/immutable';
import moment from 'moment';
import { matchPath } from 'react-router';

import PageMeta from 'components/PageMeta';
import Preloader from 'components/Preloader';
import RelatedPosts from 'components/Magazine/RelatedPosts';
import ShareButtons from 'components/Magazine/ShareButtons';
import Label from 'components/Label';
import Link from 'components/Link';

import InternalLinks from 'enum/InternalLinks';

import { requestPost } from 'pages/Magazine/sagas';

import CONFIG from '../../../conf';
import './styles.scss';

type Props = {
  requestPost: Function,
  post: Map<string, *>,
  relatedPosts: List<Map<string, *>>,
  isLoading: boolean,
  match: Object,
  location: Object,
};

class MagazinePostPage extends Component<Props> {
  componentDidMount() {
    this.props.requestPost(this.props.match.params.slug);
  }
  componentWillReceiveProps(newProps) {
    const {
      match: { params },
    } = newProps;
    if (this.props.match.params.slug !== params.slug) {
      this.props.requestPost(params.slug);
    }
  }
  render() {
    const { post, relatedPosts, isLoading, location, match } = this.props;
    const {
      params: { pathname },
    } = matchPath(match.url, {
      path: '/:pathname/:slug',
    });
    const featuredImage = getIn(post, [
      'fields',
      'featuredImage',
      'fields',
      'file',
      'url',
    ]);
    const body = getIn(post, ['fields', 'body']);
    const subtitle = getIn(post, ['fields', 'subtitle']);
    return (
      <div className="magazineBody magazineBody--cleanTopPadding">
        {isLoading ? (
          <Preloader />
        ) : (
          post && (
            <div>
              <PageMeta
                data={getIn(post, ['fields', 'seo', 'fields'])}
                title={getIn(post, ['fields', 'title'])}
                ogImage={featuredImage}
              />
              <div className="magazinePostPage row align-center">
                <div className="small-12 large-9 column">
                  <div
                    className="magazinePostPage__image"
                    style={{
                      backgroundImage: `url(${featuredImage})`,
                    }}
                  />
                  <h3>
                    <Link
                      className="c-success plain-link"
                      to={`/${pathname}/category/${getIn(post, [
                        'fields',
                        'category',
                        0,
                        'fields',
                        'slug',
                      ])}`}
                    >
                      {getIn(post, [
                        'fields',
                        'category',
                        0,
                        'fields',
                        'title',
                      ])}
                    </Link>
                  </h3>
                  <h1 className="mb-mx">{getIn(post, ['fields', 'title'])}</h1>
                  {subtitle && <h4 className="mb-mx">{subtitle}</h4>}
                  <h5 className="c-darker-gray fw-normal mb-mx">
                    By{' '}
                    <Link
                      className="magazinePostPage__name plain-link"
                      to={`/magazine/contributors/${getIn(
                        post,
                        ['fields', 'author', 0, 'fields', 'slug'],
                        ''
                      )}/`}
                    >
                      {getIn(post, ['fields', 'author', 0, 'fields', 'name'])}
                    </Link>{' '}
                    <span className="c-medium-gray">&nbsp;&bull;&nbsp;</span>{' '}
                    {moment(getIn(post, ['fields', 'date'])).format('ll')}
                  </h5>
                  <ShareButtons
                    className="mb-xl"
                    shareTitle={`${getIn(
                      post,
                      ['fields', 'title'],
                      ''
                    )} - Lift Magazine`}
                    shareUrl={`${CONFIG.APP.BASE_URL}${location.pathname}`}
                    shareDescription={getIn(post, ['fields', 'excerpt'], '')}
                  />
                  <div
                    className="contentful mb-lg fs-mx"
                    dangerouslySetInnerHTML={{
                      __html: body && marked(body),
                    }}
                  />
                  <div className="row">
                    {getIn(post, ['fields', 'tags'], fromJS([]))
                      .entrySeq()
                      .map(([key, i]) => (
                        <div className="shrink column npr" key={key}>
                          <Label
                            className="success large t-nt mb-md"
                            linksTo={`/${InternalLinks.MAGAZINE_TAG}/${getIn(i, [
                              'fields',
                              'slug',
                            ])}`}
                          >
                            {getIn(i, ['fields', 'title'])}
                          </Label>
                        </div>
                      ))}
                  </div>
                  <RelatedPosts data={relatedPosts} pathname={pathname} small />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.getIn(['magazine', 'post', 'data']),
  relatedPosts: state.getIn(['magazine', 'relatedPosts', 'data']),
  isLoading: state.getIn(['magazine', 'post', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestPost: slug => dispatch(requestPost(slug)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MagazinePostPage);
