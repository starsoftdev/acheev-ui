// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { put, call, takeEvery, all } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import client from 'utils/contentful';
import { REQUESTED, SUCCEDED, FAILED, CONTENT_TYPES } from 'enum/constants';
import type { Action, State } from 'types/common';
import CONFIG from 'conf';

// ------------------------------------
// Constants
// ------------------------------------
const CATEGORIES = 'Lift/Magazine/CATEGORIES';
const CATEGORY = 'Lift/Magazine/CATEGORY';
const CATEGORY_POSTS = 'Lift/Magazine/CATEGORY_POSTS';
const TAG = 'Lift/Magazine/TAG';
const TAGGED_POSTS = 'Lift/Magazine/TAGGED_POSTS';
const POST = 'Lift/Magazine/POST';
const RELATED_POSTS = 'Lift/Magazine/RELATED_POSTS';
const POSTS = 'Lift/Magazine/POSTS';
const CONTRIBUTORS = 'Lift/Magazine/CONTRIBUTORS';
const CONTRIBUTOR = 'Lift/Magazine/CONTRIBUTOR';

// ------------------------------------
// Actions
// ------------------------------------
export const requestPosts = () => ({
  type: POSTS + REQUESTED,
});
const postsRequestSuccess = (data: Object) => ({
  type: POSTS + SUCCEDED,
  payload: data,
});
const postsRequestFailed = error => ({
  type: POSTS + FAILED,
  payload: error,
});

export const requestCategories = () => ({
  type: CATEGORIES + REQUESTED,
});
const categoriesRequestSuccess = (categories: Object) => ({
  type: CATEGORIES + SUCCEDED,
  payload: categories,
});
const categoriesRequestFailed = error => ({
  type: CATEGORIES + FAILED,
  payload: error,
});

export const requestCategory = (slug: string) => ({
  type: CATEGORY + REQUESTED,
  payload: slug,
});
const categoryRequestSuccess = (category: Array<Object>) => ({
  type: CATEGORY + SUCCEDED,
  payload: category,
});
const categoryPostsRequestSuccess = (posts: Array<Object>) => ({
  type: CATEGORY_POSTS + SUCCEDED,
  payload: posts,
});
const categoryRequestFailed = error => ({
  type: CATEGORY + FAILED,
  payload: error,
});

export const requestTaggedPosts = (slug: string) => ({
  type: TAGGED_POSTS + REQUESTED,
  payload: slug,
});
const taggedPostsRequestSuccess = (posts: Array<Object>) => ({
  type: TAGGED_POSTS + SUCCEDED,
  payload: posts,
});
const tagRequestSuccess = (data: Object) => ({
  type: TAG + SUCCEDED,
  payload: data,
});
const taggedPostsRequestFailed = error => ({
  type: TAGGED_POSTS + FAILED,
  payload: error,
});

export const requestPost = (slug: string) => ({
  type: POST + REQUESTED,
  payload: slug,
});
const postRequestSuccess = (data: Object) => ({
  type: POST + SUCCEDED,
  payload: data,
});
const postRequestFailed = error => ({
  type: POST + FAILED,
  payload: error,
});

const relatedPostsRequestSuccess = (data: Object) => ({
  type: RELATED_POSTS + SUCCEDED,
  payload: data,
});

export const requestContributors = () => ({
  type: CONTRIBUTORS + REQUESTED,
});
const contributorsRequestSuccess = (data: Object) => ({
  type: CONTRIBUTORS + SUCCEDED,
  payload: data,
});
const contributorsRequestFailed = error => ({
  type: CONTRIBUTORS + FAILED,
  payload: error,
});

export const requestContributor = (slug: string) => ({
  type: CONTRIBUTOR + REQUESTED,
  payload: slug,
});
const contributorRequestSuccess = (
  contributor: Object,
  posts: Array<Object>
) => ({
  type: CONTRIBUTOR + SUCCEDED,
  payload: contributor,
  meta: posts,
});
const contributorRequestFailed = error => ({
  type: CONTRIBUTOR + FAILED,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  posts: {
    isLoading: false,
    response: {
      items: null,
      total: null,
    },
  },
  categories: {
    isLoading: false,
    items: null,
  },
  category: {
    isLoading: false,
    data: null,
  },
  categoryPosts: {
    isLoading: false,
    items: null,
  },
  tag: null,
  taggedPosts: {
    isLoading: false,
    items: null,
  },
  post: {
    isLoading: false,
    data: null,
  },
  relatedPosts: {
    data: null,
  },
  contributors: {
    isLoading: false,
    items: null,
  },
  contributor: {
    isLoading: false,
    about: null,
    posts: null,
  },
});

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case POSTS + REQUESTED:
      return state.setIn(['posts', 'isLoading'], true);

    case POSTS + SUCCEDED:
      return state
        .setIn(['posts', 'isLoading'], false)
        .setIn(['posts', 'response'], fromJS(payload));

    case POSTS + FAILED:
      return state.setIn(['posts', 'isLoading'], false);

    case CATEGORIES + REQUESTED:
      return state.setIn(['categories', 'isLoading'], true);

    case CATEGORIES + SUCCEDED: {
      return state
        .setIn(['categories', 'isLoading'], false)
        .setIn(['categories', 'items'], fromJS(payload));
    }

    case CATEGORIES + FAILED:
      return state.setIn(['categories', 'isLoading'], false);

    case CATEGORY + REQUESTED:
      return state
        .setIn(['category', 'items'], null)
        .setIn(['category', 'isLoading'], true)
        .setIn(['categoryPosts', 'items'], null)
        .setIn(['categoryPosts', 'isLoading'], true);

    case CATEGORY + SUCCEDED:
      return state
        .setIn(['category', 'isLoading'], false)
        .setIn(['category', 'data'], fromJS(payload));

    case CATEGORY_POSTS + SUCCEDED:
      return state
        .setIn(['categoryPosts', 'isLoading'], false)
        .setIn(['categoryPosts', 'items'], fromJS(payload));

    case CATEGORY + FAILED:
      return state
        .setIn(['category', 'isLoading'], false)
        .setIn(['categoryPosts', 'isLoading'], false);

    case TAG + SUCCEDED:
      return state.setIn(['tag'], fromJS(payload));

    case TAGGED_POSTS + REQUESTED:
      return state
        .setIn(['taggedPosts', 'items'], null)
        .setIn(['taggedPosts', 'isLoading'], true);

    case TAGGED_POSTS + SUCCEDED:
      return state
        .setIn(['taggedPosts', 'isLoading'], false)
        .setIn(['taggedPosts', 'items'], fromJS(payload));

    case TAGGED_POSTS + FAILED:
      return state.setIn(['taggedPosts', 'isLoading'], false);

    case POST + REQUESTED:
      return state
        .setIn(['post', 'isLoading'], true)
        .setIn(['post', 'data'], null);

    case POST + SUCCEDED:
      return state
        .setIn(['post', 'isLoading'], false)
        .setIn(['post', 'data'], fromJS(payload));

    case POST + FAILED:
      return state.setIn(['post', 'isLoading'], false);

    case RELATED_POSTS + SUCCEDED:
      return state.setIn(['relatedPosts', 'data'], fromJS(payload));

    case CONTRIBUTORS + REQUESTED:
      return state.setIn(['contributors', 'isLoading'], true);

    case CONTRIBUTORS + SUCCEDED:
      return state
        .setIn(['contributors', 'isLoading'], false)
        .setIn(['contributors', 'items'], fromJS(payload));

    case CONTRIBUTORS + FAILED:
      return state.setIn(['contributors', 'isLoading'], false);

    case CONTRIBUTOR + REQUESTED:
      return state
        .setIn(['contributor', 'isLoading'], true)
        .setIn(['contributor', 'about'], null)
        .setIn(['contributor', 'posts'], null);

    case CONTRIBUTOR + SUCCEDED:
      return state
        .setIn(['contributor', 'isLoading'], false)
        .setIn(['contributor', 'about'], fromJS(payload))
        .setIn(['contributor', 'posts'], fromJS(meta));

    case CONTRIBUTOR + FAILED:
      return state.setIn(['contributor', 'isLoading'], false);

    default:
      return state;
  }
};

// ------------------------------------
// Sagas
// ------------------------------------

function* CategoryRequest({ payload }) {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const category = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.CATEGORY,
        'fields.slug': payload,
      });
      yield put(categoryRequestSuccess(category.items[0]));

      const posts = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.POST,
        order: '-sys.createdAt',
        'fields.category.sys.id': category.items[0].sys.id,
        'fields.dark[exists]': false,
      });
      yield put(categoryPostsRequestSuccess(posts.items));
    }
  } catch (error) {
    yield put(categoryRequestFailed());
  }
}

function* CategoriesRequest() {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const categories = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.CATEGORY,
      });
      yield put(categoriesRequestSuccess(categories.items));
    }
  } catch (error) {
    yield put(categoriesRequestFailed());
    yield put(postsRequestFailed());
  }
}

function* PostsRequest() {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const posts = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.POST,
        order: '-fields.date',
        'fields.dark[exists]': false,
      });
      yield put(postsRequestSuccess(posts));
    }
  } catch (error) {
    yield put(categoriesRequestFailed());
    yield put(postsRequestFailed());
  }
}

function* PostRequest({ payload }) {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const response = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.POST,
        'fields.slug': payload,
      });
      const [post] = response.items;
      yield put(postRequestSuccess(post));
      const relatedPosts = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.POST,
        'fields.tags[in]': post.fields.tags.join(','),
        'fields.dark[exists]': false,
      });
      const currentPostId = post.sys.id;
      const relatedPostsWithoutCurrent = relatedPosts.items.filter(
        value => value.sys.id !== currentPostId
      );
      yield put(relatedPostsRequestSuccess(relatedPostsWithoutCurrent));
    }
  } catch (error) {
    yield put(postRequestFailed());
  }
}

function* ContributorsRequest() {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const response = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.AUTHOR,
      });
      yield put(contributorsRequestSuccess(response.items));
    }
  } catch (error) {
    yield put(contributorsRequestFailed());
  }
}

function* ContributorRequest({ payload }) {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const contributor = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.AUTHOR,
        'fields.slug': payload,
      });
      const posts = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.POST,
        'fields.author.sys.id': contributor.items[0].sys.id,
        'fields.dark[exists]': false,
      });
      yield put(contributorRequestSuccess(contributor.items[0], posts));
    }
  } catch (error) {
    yield put(contributorRequestFailed());
  }
}

function* TaggedPostsRequest({ payload }) {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const tag = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.TAG,
        'fields.slug': payload,
      });
      yield put(tagRequestSuccess(tag));
      const response = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.POST,
        order: '-sys.createdAt',
        'fields.tags.sys.id': tag.items[0].sys.id,
        'fields.dark[exists]': false,
      });
      yield put(taggedPostsRequestSuccess(response.items));
    }
  } catch (error) {
    yield put(taggedPostsRequestFailed());
  }
}

export default function*(): Saga<void> {
  yield all([
    takeEvery(CATEGORY + REQUESTED, CategoryRequest),
    takeEvery(TAGGED_POSTS + REQUESTED, TaggedPostsRequest),
    takeEvery(CATEGORIES + REQUESTED, CategoriesRequest),
    takeEvery(POSTS + REQUESTED, PostsRequest),
    takeEvery(CONTRIBUTOR + REQUESTED, ContributorRequest),
    takeEvery(CONTRIBUTORS + REQUESTED, ContributorsRequest),
    takeEvery(POST + REQUESTED, PostRequest),
  ]);
}
