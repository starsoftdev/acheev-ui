// @flow

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import type { List, Map } from 'immutable';
import { getIn } from 'utils/immutable';

import PageMeta from 'components/PageMeta';
import PostList from 'components/Magazine/PostList';
import Preloader from 'components/Preloader';

import { requestCategory } from 'pages/Magazine/sagas';

type Props = {
  categoryPosts: List<Map<*, *>>,
  category: Map<*, *>,
  requestCategory: Function,
  match: {
    params: { slug: string },
  },
  postsLoading: boolean,
  categoryLoading: boolean,
};

class MagazineCategoryPage extends React.Component<Props> {
  componentDidMount() {
    this.props.requestCategory(this.props.match.params.slug);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      this.props.requestCategory(this.props.match.params.slug);
    }
  }

  render() {
    const {
      category,
      categoryPosts,
      postsLoading,
      categoryLoading,
    } = this.props;
    return (
      <div className="magazineBody magazineBody--cleanTopPadding">
        {categoryLoading ? (
          <Preloader />
        ) : (
          <Fragment>
            <PageMeta
              data={getIn(category, ['fields', 'seo'])}
              title={getIn(category, ['fields', 'title'])}
            />
            <div className="row column text-center mb-xxl">
              <h2>{getIn(category, ['fields', 'title'])}</h2>
              <h6>{getIn(category, ['fields', 'shortDescription'])}</h6>
            </div>
          </Fragment>
        )}
        <PostList isLoading={postsLoading} data={categoryPosts} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categoryPosts: state.getIn(['magazine', 'categoryPosts', 'items']),
  category: state.getIn(['magazine', 'category', 'data']),
  postsLoading: state.getIn(['magazine', 'categoryPosts', 'isLoading']),
  categoryLoading: state.getIn(['magazine', 'category', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestCategory: slug => dispatch(requestCategory(slug)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MagazineCategoryPage);
