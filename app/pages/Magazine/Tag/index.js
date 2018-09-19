// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { List, Map } from 'immutable';
import { getIn } from 'utils/immutable';

import PostList from 'components/Magazine/PostList';
import PageMeta from 'components/PageMeta';

import { requestTaggedPosts } from 'pages/Magazine/sagas';

type Props = {
  taggedPosts: List<Map<string, *>>,
  requestTaggedPosts: Function,
  match: Object,
  isLoading: boolean,
  tag: Map<*, *>,
};

class MagazineTagPage extends React.Component<Props> {
  componentDidMount() {
    this.props.requestTaggedPosts(this.props.match.params.slug);
  }
  componentWillReceiveProps(newProps) {
    const {
      match: {
        params: { slug },
      },
    } = newProps;
    if (this.props.match.params.slug !== slug) {
      this.props.requestTaggedPosts(slug);
    }
  }
  render() {
    const { taggedPosts, isLoading, tag } = this.props;
    const title = getIn(tag, ['title']);
    return (
      <div className="magazineBody row column">
        <PageMeta data={getIn(tag, ['seo'])} title={`Tagged in ${title}`} />
        {title && (
          <h2 className="text-center mb-xxl">
            Tagged in <span className="c-success">{title}</span>
          </h2>
        )}
        <PostList isLoading={isLoading} data={taggedPosts} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  taggedPosts: state.getIn(['magazine', 'taggedPosts', 'items']),
  tag: state.getIn(['magazine', 'tag', 'items', 0, 'fields']),
  isLoading: state.getIn(['magazine', 'taggedPosts', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestTaggedPosts: slug => dispatch(requestTaggedPosts(slug)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MagazineTagPage);
