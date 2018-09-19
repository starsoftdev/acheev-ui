// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import deepReplace from 'utils/deepReplaceToString';
import { API_URL, REQUESTED, SUCCEDED, FAILED } from 'enum/constants';
import type { Action, State } from 'types/common';
import { getToken } from 'containers/App/selectors';
import moment from 'moment';

// ------------------------------------
// Constants
// ------------------------------------
const REVIEWS = 'Lift/ME/REVIEWS';
const SORT_REVIEW = 'Lift/ME/SORT_REVIEW';
// ------------------------------------
// Actions
// ------------------------------------
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
const reviewsRequestSuccess = (data: Object, append: ?boolean) => ({
  type: REVIEWS + SUCCEDED,
  payload: data,
  meta: {
    append,
  },
});
const reviewsRequestFailed = () => ({
  type: REVIEWS + FAILED,
});

export const sortReview = (sortBy: string) => ({
  type: SORT_REVIEW,
  payload: sortBy,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  isLoading: true,
  data: {
    hits: {},
  },
  filter: {
    model: {
      page: 1,
      per_page: 9999,
      sortBy: '-createdOn',
    },
  },
});

let newState = {};

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  let data;
  let hits;
  let count;
  switch (type) {
    case REVIEWS + REQUESTED:
      newState = state.setIn(['isLoading'], true);
      if (meta.path)
        return newState.setIn(
          ['filter', 'model', ...meta.path],
          fromJS(meta.value)
        );
      return newState;

    case REVIEWS + SUCCEDED:
      data = state.getIn(['data']);
      hits = state.getIn(['data', 'hits']);
      count = state.getIn(['data', 'count']);
      if (meta.append === true) {
        hits = hits.concat(fromJS(payload.data.hits));
        hits = hits.sortBy(item => -item.get('createdOn'));
        count += payload.data.count;
        data = data.setIn(['hits'], hits).setIn(['count'], count);
      } else {
        data = fromJS(payload.data);
      }
      return state.setIn(['isLoading'], false).setIn(['data'], data);

    case REVIEWS + FAILED:
      return state.setIn(['isLoading'], false);

    case SORT_REVIEW:
      hits = state.getIn(['data', 'hits']);
      hits = hits.sortBy(item => {
        switch (payload) {
          case 'rating':
            return item.get('rating');
          case '-rating':
            return -item.get('rating');
          case 'createdOn':
            return moment(item.get('createdOn'));
          default:
            return -moment(item.get('createdOn'));
        }
      });
      return state
        .setIn(['filter', 'model', 'sortBy'], payload)
        .setIn(['data', 'hits'], hits);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getModel = state =>
  deepReplace(state.getIn(['myreviews', 'filter', 'model']).toJS());
// ------------------------------------
// Sagas
// ------------------------------------
function* ReviewsRequest({ payload: user }) {
  const token = yield select(getToken);
  const model = yield select(getModel.bind(null));
  try {
    const query = { user };
    const encodedQuery = encodeURI(query);
    let populateQuery = 'user,product.business';
    const productReviewsResponse = yield call(request, {
      method: 'GET',
      url: `${API_URL}/product-reviews?query=${encodedQuery}&populate=${populateQuery}&sort=${model.sortBy}&page=${model.page}&per_page=${model.per_page}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (productReviewsResponse.status === 200) {
      yield put(reviewsRequestSuccess(productReviewsResponse));

      populateQuery = 'user,business';
      const businessReviewsResponse = yield call(request, {
        method: 'GET',
        url: `${API_URL}/business-reviews?query=${encodedQuery}&populate=${populateQuery}&sort=${model.sortBy}&page=${model.page}&per_page=${model.per_page}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (businessReviewsResponse.status === 200) {
        yield put(reviewsRequestSuccess(businessReviewsResponse, true));
      } else {
        yield put(reviewsRequestFailed());
      }
    } else {
      yield put(reviewsRequestFailed());
    }
  } catch (error) {
    yield put(reviewsRequestFailed());
  }
}

export default function*(): Saga<void> {
  yield [takeLatest(REVIEWS + REQUESTED, ReviewsRequest)];
}
