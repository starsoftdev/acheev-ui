// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import FILTER_OPTIONS from 'enum/filter/options';
import { API_URL, REQUESTED, SUCCEDED, FAILED } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import deepReplace from 'utils/deepReplaceToString';
import CONFIG from 'conf';
import AnalyticsEvents from 'enum/analytics/events';

// ------------------------------------
// Constants
// ------------------------------------
const GET_BUSINESS_FILTERS = 'Lift/Search/GET_BUSINESS_FILTERS';
const GET_BUSINESSES = 'Lift/Search/GET_BUSINESSES';

// ------------------------------------
// Actions
// ------------------------------------
export const requestBusinessFilters = (
  category: string,
  path: string,
  value: Object
) => ({
  type: GET_BUSINESS_FILTERS + REQUESTED,
  payload: value,
  meta: {
    category,
    path,
  },
});

export const requestBusinesses = (
  category: string,
  path: string,
  value: Object
) => ({
  type: GET_BUSINESSES + REQUESTED,
  payload: value,
  meta: {
    category,
    path,
  },
});
const businessesRequestSuccess = (
  category: string,
  keyword: Object,
  data: Object
) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.BUSINESS_SEARCH, {
      category,
      keyword: keyword ? keyword.$search : '',
    });
  }
  return {
    type: GET_BUSINESSES + SUCCEDED,
    payload: data,
    meta: {
      category,
    },
  };
};
const businessesRequestFailed = (category: string, error: string) => ({
  type: GET_BUSINESSES + FAILED,
  payload: error,
  meta: { category },
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  clinics: {
    filter: {
      data: {},
      isLoading: true,
      model: {
        province: FILTER_OPTIONS.FILTER_PROVINCE_OPTIONS[0],
        sort: FILTER_OPTIONS.BUSINESS_FILTER_SORT_OPTIONS[0],
      },
      query: {
        __t: 'Doctor',
      },
    },
    data: [],
    isLoading: true,
    url: 'Doctor',
  },
  dispensaries: {
    filter: {
      data: {},
      isLoading: true,
      model: {
        province: FILTER_OPTIONS.FILTER_PROVINCE_OPTIONS[0],
        sort: FILTER_OPTIONS.BUSINESS_FILTER_SORT_OPTIONS[0],
      },
      query: {
        __t: 'Dispensary',
      },
    },
    data: [],
    isLoading: true,
    url: 'Dispensary',
  },
  producers: {
    filter: {
      data: {},
      isLoading: true,
      model: {
        province: FILTER_OPTIONS.FILTER_PROVINCE_OPTIONS[0],
        sort: FILTER_OPTIONS.BUSINESS_FILTER_SORT_OPTIONS[0],
      },
      query: {
        __t: 'Producer',
      },
    },
    data: [],
    isLoading: true,
    url: 'Producer',
  },
});

let newState = {};

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case GET_BUSINESS_FILTERS + REQUESTED:
      newState = state.setIn([meta.category, 'isLoading'], false);
      if (meta.path)
        return newState.setIn(
          [meta.category, 'filter', 'model', ...meta.path],
          fromJS(payload)
        );
      return newState;
    case GET_BUSINESSES + REQUESTED:
      newState = state.setIn([meta.category, 'isLoading'], true);
      if (meta.path)
        return newState.setIn(
          [meta.category, 'filter', ...meta.path],
          fromJS(payload)
        );
      return newState;

    case GET_BUSINESSES + SUCCEDED:
      return state
        .setIn([meta.category, 'isLoading'], false)
        .setIn([meta.category, 'data'], fromJS(payload.data));

    case GET_BUSINESSES + FAILED:
      return state.setIn([meta.category, 'isLoading'], false);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getModel = (category, state) =>
  deepReplace(
    state.getIn(['businessSearch', category, 'filter', 'model']).toJS()
  );
const getQuery = (category, state) =>
  deepReplace(
    state.getIn(['businessSearch', category, 'filter', 'query']).toJS()
  );

// ------------------------------------
// Sagas
// ------------------------------------

function* BusinessesRequest({ meta: { category } }) {
  const model = yield select(getModel.bind(null, category));
  const query = yield select(getQuery.bind(null, category));
  const { q } = query;
  if (q) {
    query.$text = { $search: q };
  }
  if (model.province) {
    query['locations.province'] = model.province;
  }
  delete query.q;
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/businesses?query=${encodeURI(query)}&sort=${
        model.sort
      }&page=1&per_page=1000`,
      data: model,
    });
    if (response.status === 200) {
      yield put(businessesRequestSuccess(category, query.$text, response));
    } else {
      yield put(businessesRequestFailed(category, response.data));
    }
  } catch (error) {
    yield put(businessesRequestFailed(category, error));
  }
}

export default function*(): Saga<void> {
  yield all([takeLatest(GET_BUSINESSES + REQUESTED, BusinessesRequest)]);
}
