// @flow

import * as React from 'react';
import type { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { matchPath } from 'react-router';
import { get } from 'lodash-es';
import injectSagas from 'utils/injectSagas';
import InternalLinks from 'enum/InternalLinks';

import CategoriesMenu from 'components/Magazine/CategoriesMenu';
import Banner from 'components/Magazine/Banner';
import Preloader from 'components/Preloader';

import saga, {
  reducer,
  requestCategories,
  requestPosts,
} from 'pages/Magazine/sagas';

import Routes from './routes';
import './styles.scss';

type Props = {
  categories: List<Map<*, *>>,
  posts: List<Map<*, *>>,
  isLoading: boolean,
  requestCategories: Function,
  requestPosts: Function,
  location: Object,
  match: Object,
  slugFromStore: string,
};

class MagazineBody extends React.Component<Props> {
  componentDidMount() {
    const { categories, posts } = this.props;
    if (!categories) this.props.requestCategories();
    if (!posts) this.props.requestPosts();
  }
  render() {
    const {
      isLoading,
      location: { pathname },
      match: { url },
      categories,
      slugFromStore,
    } = this.props;
    const slugFromPathname = get(
      matchPath(pathname, {
        path: `/${InternalLinks.MAGAZINE_CATEGORY}/:slug`,
      }),
      ['params', 'slug']
    );
    return isLoading ? (
      <Preloader />
    ) : (
      <div className="magazine">
        <Banner />
        <CategoriesMenu
          data={categories}
          currentSlug={slugFromPathname || slugFromStore}
          pathname={pathname}
        />
        <Routes url={url} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['magazine', 'categories', 'isLoading']),
  categories: state.getIn(['magazine', 'categories', 'items']),
  posts: state.getIn(['magazine', 'posts', 'response', 'items']),
  slugFromStore: state.getIn([
    'magazine',
    'post',
    'data',
    'fields',
    'category',
    0,
    'fields',
    'slug',
  ]),
});

const mapDispatchToProps = dispatch => ({
  requestCategories: () => dispatch(requestCategories()),
  requestPosts: () => dispatch(requestPosts()),
});

export default compose(
  injectSagas({ key: 'magazine', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MagazineBody);
