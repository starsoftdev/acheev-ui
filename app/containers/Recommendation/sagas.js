// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, takeEvery, all, select } from 'redux-saga/effects';
import { stringify } from 'qs';
import { chunk } from 'lodash';
import moment from 'moment';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import {
  API_URL,
  RECO_API_URL,
  REQUESTED,
  SUCCEDED,
  FAILED,
} from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';

// ------------------------------------
// Constants
// ------------------------------------
const GET_RECOMMENDATION = 'Lift/RECO/GET_RECOMMENDATION';
const GET_PRODUCTS = 'Lift/RECO/GET_PRODUCTS';
const PRODUCTS_PER_PAGE = 12;
// ------------------------------------
// Actions
// ------------------------------------
export const requestRecoProducts = (category: string, query: Object) => ({
  type: GET_RECOMMENDATION + REQUESTED,
  payload: {
    query,
  },
  meta: { category },
});
const recoProductsRequestSuccess = (category: string, data: Object) => ({
  type: GET_RECOMMENDATION + SUCCEDED,
  payload: data,
  meta: { category },
});
const recoProductsRequestFailed = (category: string, error: string) => ({
  type: GET_RECOMMENDATION + FAILED,
  payload: error,
  meta: { category },
});
export const requestFullProducts = (category: string, page: number) => ({
  type: GET_PRODUCTS + REQUESTED,
  payload: { page },
  meta: { category },
});
const fullProductsRequestSuccess = (category: string, data: Object) => ({
  type: GET_PRODUCTS + SUCCEDED,
  payload: data,
  meta: { category },
});
const fullProductsRequestFailed = (category: string, error: string) => ({
  type: GET_PRODUCTS + FAILED,
  payload: error,
  meta: { category },
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  strain: {
    data: null,
    products: {
      hits: null,
      isLoading: true,
    },
    page: 0,
    isLoading: true,
  },
  oil: {
    data: null,
    products: {
      hits: null,
      isLoading: true,
    },
    page: 0,
    isLoading: true,
  },
});

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case GET_RECOMMENDATION + REQUESTED:
      return state
        .setIn([meta.category, 'isLoading'], true)
        .setIn(
          [meta.category, 'products'],
          fromJS({ hits: null, isLoading: true })
        );
    case GET_RECOMMENDATION + SUCCEDED: {
      const { data } = payload;
      data.hits = chunk(data.hits, PRODUCTS_PER_PAGE);
      return state
        .setIn([meta.category, 'isLoading'], false)
        .setIn([meta.category, 'data'], fromJS(payload.data))
        .setIn([meta.category, 'page'], 0);
    }
    case GET_RECOMMENDATION + FAILED:
      return state.setIn([meta.category, 'isLoading'], false);
    case GET_PRODUCTS + REQUESTED:
      return state
        .setIn(
          [meta.category, 'products'],
          fromJS({ hits: null, isLoading: true })
        )
        .setIn([meta.category, 'page'], payload.page);
    case GET_PRODUCTS + SUCCEDED:
      return state
        .setIn([meta.category, 'products', 'isLoading'], false)
        .setIn([meta.category, 'products', 'hits'], fromJS(payload));
    case GET_PRODUCTS + FAILED:
      return state.setIn([meta.category, 'products', 'isLoading'], false);
    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getRecoProductsByPage = (category, page, state) =>
  state.getIn(['recommend', category, 'data', 'hits', page - 1]);

// ------------------------------------
// Sagas
// ------------------------------------
function* RecoProductsRequest({ payload: { query }, meta: { category } }) {
  try {
    const recoParam = {
      ages: `${moment().year() - query.yearOfBirth}plus`,
      expLevel: query.experience,
      gender: query.gender,
      desiredEffects: query.toTreat.join(','),
    };
    const url = `${RECO_API_URL}/search?${stringify(
      recoParam
    )}&type=${category}`;
    const data = yield call(request, { url });
    yield put(recoProductsRequestSuccess(category, data));
    yield put(requestFullProducts(category, 1));
  } catch (error) {
    yield put(recoProductsRequestFailed(category, error));
  }
}
function* fullProductsRequest({ payload: { page }, meta: { category } }) {
  const recoProductIds = yield select(
    getRecoProductsByPage.bind(null, category, page)
  );
  if (recoProductIds) {
    const query: Object = {
      id: {
        $in: recoProductIds,
      },
    };
    const url = `${API_URL}/products?query=${encodeURI(
      query
    )}&populate=business`;
    try {
      const response = yield call(request, { url });
      if (response.status === 200) {
        yield put(fullProductsRequestSuccess(category, response.data.hits));
      } else {
        yield put(fullProductsRequestFailed(category, response.data.message));
      }
    } catch (error) {
      yield put(fullProductsRequestFailed(category, error));
    }
  }
}

export default function*(): Saga<void> {
  yield all([
    takeEvery(GET_RECOMMENDATION + REQUESTED, RecoProductsRequest),
    takeEvery(GET_PRODUCTS + REQUESTED, fullProductsRequest),
  ]);
}
