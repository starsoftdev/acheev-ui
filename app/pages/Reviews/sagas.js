// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import deepReplace from 'utils/deepReplaceToString';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const REVIEWS = 'Lift/REVIEWS';
const SORT_REVIEW = 'Lift/SORT_REVIEW';
const CHANGE_REVIEW_CATEGORY = 'Lift/CHANGE_REVIEW_CATEGORY';
const VOTE_REVIEW = 'Lift/VOTE_REVIEW';
const DELETE_REVIEW = 'Lift/DELETE_REVIEW';
const SET_FILTERS = 'Lift/REVIEWS/SET_FILTERS';

export const requestReviews = (path: string, value: ?Object) => ({
  type: REVIEWS + REQUESTED,
  payload: value,
  meta: {
    path,
  },
});
const reviewsRequestSuccess = (data: Object) => ({
  type: REVIEWS + SUCCEDED,
  payload: data,
});
const reviewsRequestFailed = (error: string) => ({
  type: REVIEWS + FAILED,
  payload: error,
});

export const sortReview = (sortBy: string) => ({
  type: SORT_REVIEW,
  payload: sortBy,
});

export const changeReviewCategory = (category: string) => ({
  type: CHANGE_REVIEW_CATEGORY,
  payload: category,
});

export const voteReview = (reviewId: string, type: string) => ({
  type: VOTE_REVIEW + REQUESTED,
  reviewId,
  meta: { type },
});
const reviewVoteSuccess = (reviewId: string) => ({
  type: VOTE_REVIEW + SUCCEDED,
  reviewId,
});
const reviewVoteError = error => ({
  type: VOTE_REVIEW + ERROR,
  payload: error,
});

export const deleteReview = (reviewId: string) => ({
  type: DELETE_REVIEW + REQUESTED,
  reviewId,
});
const reviewDeleteSuccess = () => ({
  type: DELETE_REVIEW + SUCCEDED,
});
const reviewDeleteError = error => ({
  type: DELETE_REVIEW + ERROR,
  payload: error,
});

export const setFilters = (parsedSearch: Object) => ({
  type: SET_FILTERS,
  payload: parsedSearch,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  data: {
    hits: {},
  },
  model: {
    category: 'product',
    page: null,
    per_page: null,
    sortBy: '-createdOn',
  },
  isLoading: false,
  error: '',
  reviewVote: {
    isLoading: false,
    error: '',
  },
  review: {
    isLoading: false,
    error: '',
  },
});

let newState = {};

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case REVIEWS + REQUESTED:
      newState = state.setIn(['isLoading'], true);
      if (meta.path)
        return newState.setIn(['model', ...meta.path], fromJS(payload));
      return newState;

    case REVIEWS + SUCCEDED:
      return state
        .setIn(['isLoading'], false)
        .setIn(['data'], fromJS(payload.data));

    case REVIEWS + FAILED:
      return state.setIn(['isLoading'], false);

    case SORT_REVIEW:
      return state.setIn(['model', 'sortBy'], payload);

    case CHANGE_REVIEW_CATEGORY:
      return state.setIn(['model', 'category'], payload);

    case DELETE_REVIEW + REQUESTED:
      return state
        .setIn(['review', 'isLoading'], true)
        .setIn(['review', 'error'], '');

    case DELETE_REVIEW + SUCCEDED:
      return state
        .setIn(['review', 'isLoading'], false)
        .setIn(['review', 'error'], '');

    case DELETE_REVIEW + ERROR:
      return state.setIn(['review', 'isLoading'], false).setIn(
        ['review', 'error'],
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case VOTE_REVIEW + REQUESTED:
      return state
        .setIn(['reviewVote', 'isLoading'], true)
        .setIn(['reviewVote', 'error'], '');

    case VOTE_REVIEW + SUCCEDED:
      return state
        .setIn(['reviewVote', 'isLoading'], false)
        .setIn(['reviewVote', 'error'], '');

    case VOTE_REVIEW + ERROR:
      return state.setIn(['reviewVote', 'isLoading'], false).setIn(
        ['reviewVote', 'error'],
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case SET_FILTERS: {
      const {
        page = 1,
        per_page = 10, // eslint-disable-line camelcase
        category = 'product',
        sort = '-createdOn',
      } = payload;
      newState = state.set(
        'model',
        fromJS({
          category,
          page: Number(page),
          per_page: Number(per_page),
          sortBy: sort,
        })
      );

      return newState;
    }

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getModel = state => deepReplace(state.getIn(['reviews', 'model']).toJS());

// ------------------------------------
// Sagas
// ------------------------------------

function* ReviewsRequest() {
  const model = yield select(getModel.bind(null));
  try {
    const query: Object = {
      message: { $exists: true, $not: { $eq: '' } },
      title: { $exists: true, $not: { $eq: '' } },
    };
    const encodedQuery = encodeURI(query);
    const { category } = model;
    let populateQuery = 'user,business';
    if (category === 'product') {
      populateQuery = 'user,product.business';
      query.product = { $exists: true };
      query.__t = { $eq: 'CannabisProductReview' }; // eslint-disable-line no-underscore-dangle
    } else {
      populateQuery = 'user,business';
      query.business = { $exists: true };
    }
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/${
        model.category
      }-reviews?query=${encodedQuery}&populate=${populateQuery}&sort=${
        model.sortBy
      }&page=${model.page}&per_page=${model.per_page}`,
    });
    if (response.status === 200) {
      yield put(reviewsRequestSuccess(response));
    } else {
      yield put(reviewsRequestFailed(response.data));
    }
  } catch (error) {
    yield put(reviewsRequestFailed(error));
  }
}

function* VoteReviewRequest({ reviewId, meta: { type } }) {
  const model = yield select(getModel.bind(null));
  try {
    const token = yield select(getToken);
    let url = `${API_URL}/${model.category}-reviews/${reviewId}/`;
    if (type === 'up') {
      url += 'upvotes';
    } else if (type === 'down') {
      url += 'downvotes';
    }
    const response = yield call(request, {
      method: 'POST',
      url,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(reviewVoteSuccess(response));
    } else {
      yield put(reviewVoteError(response.data));
    }
  } catch (error) {
    yield put(reviewVoteError(error));
  }
}

function* DeleteReviewRequest({ reviewId }) {
  const model = yield select(getModel.bind(null));
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/${model.category}-reviews/${reviewId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(reviewDeleteSuccess());
    } else if (response.status === 204) {
      yield put(reviewDeleteSuccess());
    } else {
      yield put(reviewDeleteError(response.data));
    }
  } catch (error) {
    yield put(reviewDeleteError(error));
  }
}

export default function* deleteReviewWatcher(): Saga<void> {
  yield all([
    takeLatest(DELETE_REVIEW + REQUESTED, DeleteReviewRequest),
    takeLatest(VOTE_REVIEW + REQUESTED, VoteReviewRequest),
    takeLatest(REVIEWS + REQUESTED, ReviewsRequest),
  ]);
}
