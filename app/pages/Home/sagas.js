// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import {
  API_URL,
  NEWS_API_URL,
  REQUESTED,
  STARTED,
  SKIPPED,
  SUCCEDED,
  FAILED,
} from 'enum/constants';
import type { Action, State } from 'types/common';

// ------------------------------------
// Constants
// ------------------------------------
const GET_FILTERABLE_PRODUCTS = 'Lift/HomePage/GET_FILTERABLE_PRODUCTS';
const GET_RECENT_NEWS = 'Lift/HomePage/GET_RECENT_NEWS';
const GET_RECENT_REVIEWS = 'Lift/HomePage/GET_RECENT_REVIEWS';
const GET_RECENT_VIDEOS = 'Lift/HomePage/GET_RECENT_VIDEOS';
// ------------------------------------
// Actions
// ------------------------------------
export const requestFilterableProducts = (index: number, category: string) => ({
  type: GET_FILTERABLE_PRODUCTS + REQUESTED,
  payload: index,
  meta: { category },
});
const startFilterableProductsRequest = (category: string) => ({
  type: GET_FILTERABLE_PRODUCTS + STARTED,
  meta: { category },
});
const skipFilterableProductsRequest = () => ({
  type: GET_FILTERABLE_PRODUCTS + SKIPPED,
});
const filterableProductsRequestSuccess = (
  category: string,
  index: number,
  data: Object
) => ({
  type: GET_FILTERABLE_PRODUCTS + SUCCEDED,
  payload: data,
  meta: {
    index,
    category,
  },
});
const filterableProductsRequestFailed = error => ({
  type: GET_FILTERABLE_PRODUCTS + FAILED,
  payload: error,
});

export const requestRecentNews = () => ({
  type: GET_RECENT_NEWS + REQUESTED,
});
const recentNewsRequestSuccess = (data: Object) => ({
  type: GET_RECENT_NEWS + SUCCEDED,
  payload: data,
});
const recentNewsRequestFailed = error => ({
  type: GET_RECENT_NEWS + FAILED,
  payload: error,
});

export const requestRecentReviews = () => ({
  type: GET_RECENT_REVIEWS + REQUESTED,
});
const recentReviewsRequestSuccess = (data: Object) => ({
  type: GET_RECENT_REVIEWS + SUCCEDED,
  payload: data,
});
const recentReviewsRequestFailed = error => ({
  type: GET_RECENT_REVIEWS + FAILED,
  payload: error,
});

export const requestRecentVideos = () => ({
  type: GET_RECENT_VIDEOS + REQUESTED,
});
const recentVideosRequestSuccess = (data: Object) => ({
  type: GET_RECENT_VIDEOS + SUCCEDED,
  payload: data,
});
const recentVideosRequestFailed = () => ({
  type: GET_RECENT_VIDEOS + FAILED,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  strains: {
    url: 'Strain',
    filters: [
      {
        index: 0,
        name: 'Most popular',
        sort: '-reviewCount',
        items: null,
      },
      {
        index: 1,
        name: 'Trending',
        sort: '-rating,-createdOn',
        items: null,
      },
      {
        index: 2,
        name: 'New',
        sort: '-createdOn',
        items: null,
      },
    ],
    isLoading: true,
    active: 0,
  },
  accessories: {
    url: { $exists: false },
    filters: [
      {
        index: 0,
        name: 'Most popular',
        sort: '-reviewCount',
        items: null,
      },
      {
        index: 1,
        name: 'Trending',
        sort: '-rating,-createdOn',
        items: null,
      },
      {
        index: 2,
        name: 'New',
        sort: '-createdOn',
        items: null,
      },
    ],
    isLoading: true,
    active: 0,
  },
  oils: {
    url: 'Oil',
    filters: [
      {
        index: 0,
        name: 'Most popular',
        sort: '-reviewCount',
        items: null,
      },
      {
        index: 1,
        name: 'Trending',
        sort: '-rating,-createdOn',
        items: null,
      },
      {
        index: 2,
        name: 'New',
        sort: '-createdOn',
        items: null,
      },
    ],
    isLoading: true,
    active: 0,
  },
  recentReviews: {
    data: {
      hits: {},
    },
    isLoading: false,
  },
  recentVideos: {
    data: {},
    isLoading: false,
  },
});

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case GET_FILTERABLE_PRODUCTS + REQUESTED:
      return state.setIn([meta.category, 'active'], payload);

    case GET_FILTERABLE_PRODUCTS + STARTED:
      return state.setIn([meta.category, 'isLoading'], true);

    case GET_FILTERABLE_PRODUCTS + SUCCEDED:
      return state
        .setIn([meta.category, 'isLoading'], false)
        .setIn(
          [meta.category, 'filters', meta.index, 'items'],
          fromJS(payload.data.hits)
        );

    case GET_FILTERABLE_PRODUCTS + FAILED:
      return state.setIn([meta.category, 'isLoading'], false);

    case GET_RECENT_NEWS + REQUESTED:
      return state.set('isLoading', true);

    case GET_RECENT_NEWS + SUCCEDED:
      return state.set('isLoading', false).set('news', fromJS(payload));

    case GET_RECENT_NEWS + FAILED:
      return state.set('news', payload);

    case GET_RECENT_REVIEWS + REQUESTED:
      return state.setIn(['recentReviews', 'isLoading'], true);

    case GET_RECENT_REVIEWS + SUCCEDED:
      return state
        .setIn(['recentReviews', 'isLoading'], false)
        .setIn(['recentReviews', 'data'], fromJS(payload));

    case GET_RECENT_REVIEWS + FAILED:
      return state.setIn(['recentReviews', 'isLoading'], false);

    case GET_RECENT_VIDEOS + REQUESTED:
      return state.setIn(['recentVideos', 'isLoading'], true);

    case GET_RECENT_VIDEOS + SUCCEDED:
      return state
        .setIn(['recentVideos', 'isLoading'], false)
        .setIn(['recentVideos', 'data'], fromJS(payload));

    case GET_RECENT_VIDEOS + FAILED:
      return state.setIn(['recentVideos', 'isLoading'], false);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getFilter = (index, category, state) =>
  state.getIn(['home', category, 'filters', index, 'items']);
const getUrl = (index, category, state) =>
  `products?query=${encodeURI({
    __t: state.getIn(['home', category, 'url']),
  })}&page=1&per_page=4&populate=business&sort=${state.getIn([
    'home',
    category,
    'filters',
    index,
    'sort',
  ])}`;

// ------------------------------------
// Sagas
// ------------------------------------
function* FilterableProductsRequest({ payload: index, meta: { category } }) {
  const filterItems = yield select(getFilter.bind(null, index, category));
  const url = yield select(getUrl.bind(null, index, category));
  if (filterItems) {
    yield put(skipFilterableProductsRequest());
  } else {
    try {
      yield put(startFilterableProductsRequest(category));
      const data = yield call(request, { url: `${API_URL}/${url}` });
      yield put(filterableProductsRequestSuccess(category, index, data));
    } catch (error) {
      yield put(filterableProductsRequestFailed(error));
    }
  }
}

function* RecentNewsRequest() {
  const url = `${NEWS_API_URL}/posts?per_page=3&_embed`;
  try {
    const response = yield call(request, { url });
    if (response.status === 200) {
      yield put(recentNewsRequestSuccess(response.data));
    } else {
      yield put(recentNewsRequestFailed(response.data[0].message));
    }
  } catch (error) {
    yield put(recentNewsRequestFailed(error));
  }
}

function* RecentReviewsRequest() {
  const url = `${API_URL}/product-reviews?sort=-createdOn&populate=user,product.business&page=1&per_page=3`;
  try {
    const response = yield call(request, { url });
    if (response.status === 200) {
      yield put(recentReviewsRequestSuccess(response.data));
    } else {
      yield put(recentReviewsRequestFailed(response.data[0].message));
    }
  } catch (error) {
    yield put(recentReviewsRequestFailed(error));
  }
}

function* RecentVideosRequest() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCsGKEoUX71bk8SWRZyQxcQQ&key=AIzaSyAj9_wplm0clr6xkNo6rbDucLUG29l7QX8`;
  try {
    const response = yield call(request, { url });
    if (response.status === 200) {
      const playlistId =
        response.data.items[0].contentDetails.relatedPlaylists.uploads;
      const playlists = yield call(request, {
        url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=AIzaSyAj9_wplm0clr6xkNo6rbDucLUG29l7QX8`,
      });
      if (playlists.status === 200) {
        yield put(recentVideosRequestSuccess(playlists.data));
      } else {
        yield put(recentVideosRequestFailed());
      }
    } else {
      yield put(recentVideosRequestFailed());
    }
  } catch (error) {
    yield put(recentVideosRequestFailed());
  }
}

export default function*(): Saga<void> {
  yield [
    takeLatest(GET_RECENT_VIDEOS + REQUESTED, RecentVideosRequest),
    takeLatest(GET_RECENT_REVIEWS + REQUESTED, RecentReviewsRequest),
    takeLatest(GET_RECENT_NEWS + REQUESTED, RecentNewsRequest),
    takeEvery(GET_FILTERABLE_PRODUCTS + REQUESTED, FilterableProductsRequest),
  ];
}
