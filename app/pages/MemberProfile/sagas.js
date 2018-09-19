// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import deepReplace from 'utils/deepReplaceToString';
import { stringify } from 'qs';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const PROFILE = 'Lift/Member/PROFILE';
const REVIEWS = 'Lift/Member/REVIEWS';
const SORT_REVIEW = 'Lift/SORT_REVIEW';
const CHANGE_REVIEW_CATEGORY = 'Lift/CHANGE_REVIEW_CATEGORY';
const VOTE_REVIEW = 'Lift/VOTE_REVIEW';
const DELETE_REVIEW = 'Lift/DELETE_REVIEW';
const FOLLOWINGS = 'Lift/Member/FOLLOWINGS';

// ------------------------------------
// Actions
// ------------------------------------
export const requestMemberProfile = (slug: string) => ({
  type: PROFILE + REQUESTED,
  payload: slug,
});
const profileRequestSuccess = (data: Object) => ({
  type: PROFILE + SUCCEDED,
  payload: data,
});
const profileRequestFailed = () => ({
  type: PROFILE + FAILED,
});

export const requestReviews = (
  userId: string,
  path: ?string,
  value: ?Object
) => ({
  type: REVIEWS + REQUESTED,
  payload: userId,
  meta: {
    path,
    value,
  },
});
const reviewsRequestSuccess = (data: Object) => ({
  type: REVIEWS + SUCCEDED,
  payload: data,
});
const reviewsRequestFailed = (error?: string) => ({
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

export const requestFollowings = (
  userId: string,
  path: string,
  value: Object
) => ({
  type: FOLLOWINGS + REQUESTED,
  payload: userId,
  meta: {
    path,
    value,
  },
});
const followingsRequestSuccess = (data: Object) => ({
  type: FOLLOWINGS + SUCCEDED,
  payload: data,
});
const followingsRequestFailed = () => ({
  type: FOLLOWINGS + FAILED,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  profile: {
    isLoading: true,
    data: null,
  },
  reviews: {
    data: {
      hits: {},
    },
    filter: {
      model: {
        category: 'product',
        page: 1,
        per_page: 10,
        sortBy: '-createdOn',
      },
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
  },
  followings: {
    filter: {
      model: {
        page: 1,
        per_page: 8,
      },
    },
    isLoading: false,
    data: null,
  },
});

let newState = {};

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case PROFILE + SUCCEDED:
      return state
        .setIn(['profile', 'isLoading'], false)
        .setIn(['profile', 'data'], fromJS(payload.data));

    case PROFILE + FAILED:
      return state.setIn(['profile', 'isLoading'], false);

    case REVIEWS + REQUESTED:
      newState = state.setIn(['reviews', 'isLoading'], true);
      if (meta.path)
        return newState.setIn(
          ['reviews', 'filter', 'model', ...meta.path],
          fromJS(meta.value)
        );
      return newState;

    case REVIEWS + SUCCEDED:
      return state
        .setIn(['reviews', 'isLoading'], false)
        .setIn(['reviews', 'data'], fromJS(payload.data));

    case REVIEWS + FAILED:
      return state.setIn(['reviews', 'isLoading'], false);

    case SORT_REVIEW:
      return state.setIn(['reviews', 'filter', 'model', 'sortBy'], payload);

    case CHANGE_REVIEW_CATEGORY:
      return state.setIn(['reviews', 'filter', 'model', 'category'], payload);

    case DELETE_REVIEW + REQUESTED:
      return state
        .setIn(['reviews', 'review', 'isLoading'], true)
        .setIn(['reviews', 'review', 'error'], '');

    case DELETE_REVIEW + SUCCEDED:
      return state
        .setIn(['reviews', 'review', 'isLoading'], false)
        .setIn(['reviews', 'review', 'error'], '');

    case DELETE_REVIEW + ERROR:
      return state.setIn(['reviews', 'review', 'isLoading'], false).setIn(
        ['reviews', 'review', 'error'],
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case VOTE_REVIEW + REQUESTED:
      return state
        .setIn(['reviews', 'reviewVote', 'isLoading'], true)
        .setIn(['reviews', 'reviewVote', 'error'], '');

    case VOTE_REVIEW + SUCCEDED:
      return state
        .setIn(['reviews', 'reviewVote', 'isLoading'], false)
        .setIn(['reviews', 'reviewVote', 'error'], '');

    case VOTE_REVIEW + ERROR:
      return state.setIn(['reviews', 'reviewVote', 'isLoading'], false).setIn(
        ['reviews', 'reviewVote', 'error'],
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case FOLLOWINGS + REQUESTED:
      newState = state.setIn(['followings', 'isLoading'], true);

      if (meta.path) {
        return newState.setIn(
          ['followings', 'filter', ...meta.path],
          fromJS(meta.value)
        );
      }
      return newState;

    case FOLLOWINGS + SUCCEDED:
      return state
        .setIn(['followings', 'isLoading'], false)
        .setIn(['followings', 'data'], fromJS(payload.data));

    case FOLLOWINGS + FAILED:
      return state.setIn(['followings', 'isLoading'], false);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getModel = (category, state) =>
  deepReplace(
    state.getIn(['memberProfile', category, 'filter', 'model']).toJS()
  );
// ------------------------------------
// Sagas
// ------------------------------------
function* ProfileRequest({ payload: slug }) {
  try {
    const response = yield call(request, {
      url: `${API_URL}/users?query=${encodeURI({ slug })}`,
    });
    yield put(profileRequestSuccess(response));
  } catch (error) {
    yield put(profileRequestFailed());
  }
}

function* ReviewsRequest({ payload: user }) {
  const model = yield select(getModel.bind(null, 'reviews'));
  try {
    const query: Object = {
      message: { $exists: true },
      user,
    };
    const encodedQuery = encodeURI(query);
    const { category } = model;
    let populateQuery = 'user,business';
    if (category === 'product') {
      populateQuery = 'user,product.business';
      query.product = { $exists: true };
    } else {
      populateQuery = 'user,business';
      query.business = { $exists: true };
    }
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/${model.category}-reviews?query=${encodedQuery}&populate=${populateQuery}&sort=${model.sortBy}&page=${model.page}&per_page=${model.per_page}`,
    });
    if (response.status === 200) {
      yield put(reviewsRequestSuccess(response));
    } else {
      yield put(reviewsRequestFailed(response.data));
    }
  } catch (error) {
    yield put(reviewsRequestFailed());
  }
}

function* VoteReviewRequest({ reviewId, meta: { type } }) {
  const model = yield select(getModel.bind(null, 'reviews'));
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
  const model = yield select(getModel.bind(null, 'reviews'));
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

function* FollowingsRequest({ payload: user }) {
  const model = yield select(getModel.bind(null, 'followings'));
  try {
    const reviews = yield call(request, {
      url: `${API_URL}/follows?query=${encodeURI({
        user,
        itemType: 'Product',
      })}&${stringify(model)}`,
    });
    yield put(followingsRequestSuccess(reviews));
  } catch (error) {
    yield put(followingsRequestFailed());
  }
}

export default function*(): Saga<void> {
  yield [
    takeLatest(FOLLOWINGS + REQUESTED, FollowingsRequest),
    takeLatest(DELETE_REVIEW + REQUESTED, DeleteReviewRequest),
    takeLatest(VOTE_REVIEW + REQUESTED, VoteReviewRequest),
    takeLatest(REVIEWS + REQUESTED, ReviewsRequest),
    takeLatest(PROFILE + REQUESTED, ProfileRequest),
  ];
}
