// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux
import { fromJS, Iterable } from 'immutable';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import { stringify } from 'qs';
import { isEqual, reduce, xor, chunk } from 'lodash-es';

import request from 'utils/request';
import deepReplace from 'utils/deepReplaceToString';
import encodeURI from 'utils/encodeURI';
import {
  API_URL,
  REQUESTED,
  STARTED,
  SKIPPED,
  SUCCEDED,
  FAILED,
} from 'enum/constants';
import FILTER_OPTIONS from 'enum/filter/options';

import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import AnalyticsEvents from 'enum/analytics/events';
import CONFIG from '../../conf';

// ------------------------------------
// Constants
// ------------------------------------
const GET_FILTERS = 'Lift/Search/GET_FILTERS';
const SET_FILTERS = 'Lift/Search/SET_FILTERS';
const SET_QUERY = 'Lift/Search/SET_QUERY';
const GET_PRODUCTS = 'Lift/Search/GET_PRODUCTS';
const RESET_QUERY = 'Lift/Search/RESET_QUERY';
// ------------------------------------
// Actions
// ------------------------------------
export const requestFilters = (category: string) => ({
  type: GET_FILTERS + REQUESTED,
  meta: { category },
});
const startFiltersRequest = category => ({
  type: GET_FILTERS + STARTED,
  meta: { category },
});
const skipFiltersRequest = () => ({
  type: GET_FILTERS + SKIPPED,
});
const filtersRequestSuccess = (category: string, data: Object) => ({
  type: GET_FILTERS + SUCCEDED,
  payload: data,
  meta: { category },
});
const filtersRequestFailed = (category: string, error: string) => ({
  type: GET_FILTERS + FAILED,
  payload: error,
  meta: { category },
});

export const setQuery = (category: string, value: Object) => ({
  type: SET_QUERY,
  payload: value,
  meta: {
    category,
  },
});

export const setFilters = (category: string, parsedSearch: Object) => ({
  type: SET_FILTERS,
  payload: parsedSearch,
  meta: { category },
});

export const requestProducts = (
  category: string,
  path: string,
  value: Object
) => ({
  type: GET_PRODUCTS + REQUESTED,
  payload: value,
  meta: {
    category,
    path,
  },
});
const productsRequestSuccess = (
  category: string,
  keyword: Object,
  data: Object
) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.PRODUCT_SEARCH, {
      category,
      keyword: keyword ? keyword.$search : '',
    });
  }
  return {
    type: GET_PRODUCTS + SUCCEDED,
    payload: data,
    meta: {
      category,
    },
  };
};
const productsRequestFailed = (category: string, error: string) => ({
  type: GET_PRODUCTS + FAILED,
  payload: error,
  meta: { category },
});

export const resetQuery = (category: string) => ({
  type: RESET_QUERY,
  payload: category,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  Strain: {
    filter: {
      data: null,
      isLoading: false,
      model: {
        per_page: null,
        sort: '-createdOn',
      },
      query: {},
      __t: 'Strain',
      page: null,
    },
    data: {},
    isLoading: true,
  },
  Oil: {
    filter: {
      data: null,
      isLoading: false,
      model: {
        per_page: null,
        sort: '-createdOn',
      },
      query: {},
      __t: 'Oil',
      page: null,
    },
    data: {},
    isLoading: true,
  },
  Product: {
    filter: {
      data: null,
      isLoading: true,
      model: {
        per_page: null,
        sort: '-createdOn',
      },
      query: {},
      __t: { $exists: false },
      page: null,
    },
    data: {},
    isLoading: true,
  },
});

let newState = null;
let loadingState = null;
const pagePath = ['page'];

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case GET_FILTERS + STARTED:
      return state.setIn([meta.category, 'filter', 'isLoading'], true);

    case GET_FILTERS + SUCCEDED:
      return state
        .setIn([meta.category, 'filter', 'isLoading'], false)
        .setIn(
          [meta.category, 'filter', 'data'],
          fromJS(payload.data[meta.category])
        );

    case GET_FILTERS + FAILED:
      return state.setIn([meta.category, 'filter', 'isLoading'], false);

    case SET_QUERY: {
      const q = state.getIn([meta.category, 'filter', 'query', 'q']);
      let query = fromJS(payload);
      if (q) {
        query = query.set('q', q);
      }

      return state.setIn([meta.category, 'filter', 'query'], query);
    }

    case SET_FILTERS: {
      const {
        page = 1,
        perPage = FILTER_OPTIONS.PRODUCT_FILTER_SHOW_OPTIONS[0],
        query,
        ...otherKeys
      } = payload;
      newState = state
        .setIn([meta.category, 'filter', 'page'], Number(page))
        .setIn(
          [meta.category, 'filter', 'model'],
          fromJS({
            per_page: Number(perPage),
            sort: '-popularity',
            ...otherKeys,
          })
        );
      if (query) {
        return newState.setIn(
          [meta.category, 'filter', 'query'],
          fromJS(query)
        );
      }
      return newState;
    }

    case GET_PRODUCTS + REQUESTED:
      loadingState = state.setIn([meta.category, 'isLoading'], true);

      if (meta.path) {
        if (!isEqual(meta.path, pagePath)) {
          // reset pagination when user changes any filter except `page`
          newState = loadingState.setIn(
            [meta.category, 'filter', ...pagePath],
            1
          );
        } else {
          newState = loadingState;
        }
        if (payload && payload.length === 0) {
          return newState.deleteIn([meta.category, 'filter', ...meta.path]);
        }
        return newState.setIn(
          [meta.category, 'filter', ...meta.path],
          fromJS(payload)
        );
      }
      return loadingState;

    case GET_PRODUCTS + SUCCEDED: {
      let newData = fromJS(payload.data);

      const page = state.getIn([meta.category, 'filter', 'page']);
      const currentHits = state.getIn([meta.category, 'data', 'hits']);
      if (page && page > 1 && currentHits) {
        newData = newData.set('hits', currentHits.concat(newData.get('hits')));
      }
      return state
        .setIn([meta.category, 'isLoading'], false)
        .setIn([meta.category, 'data'], newData);
    }

    case GET_PRODUCTS + FAILED:
      return state.setIn([meta.category, 'isLoading'], false);

    case RESET_QUERY:
      return state
        .setIn([payload, 'filter', 'page'], 1)
        .setIn(
          [payload, 'filter', 'model'],
          fromJS({
            per_page: FILTER_OPTIONS.PRODUCT_FILTER_SHOW_OPTIONS[0],
          })
        )
        .setIn([payload, 'filter', 'query'], fromJS({}));

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getFilter = (category, state) =>
  state.getIn(['search', category, 'filter', 'data']);
const getModel = (category, state) =>
  state.getIn(['search', category, 'filter', 'model']).toJS();
const getQuery = (category, state) =>
  deepReplace(state.getIn(['search', category, 'filter', 'query']).toJS());
const getPage = (category, state) =>
  state.getIn(['search', category, 'filter', 'page']);
const getCategory = (category, state) => {
  const __t = state.getIn(['search', category, 'filter', '__t']);
  return Iterable.isIterable(__t) ? __t.toJS() : __t;
};

// ------------------------------------
// Sagas
// ------------------------------------
function* FiltersRequest({ meta: { category } }) {
  const filter = yield select(getFilter.bind(null, category));
  if (filter) {
    yield put(skipFiltersRequest());
  } else {
    try {
      yield put(startFiltersRequest(category));
      const data = yield call(request, { url: `${API_URL}/products/filters` });
      yield put(filtersRequestSuccess(category, data));
    } catch (error) {
      yield put(filtersRequestFailed(category, error));
    }
  }
}

function* ProductsRequest({ meta: { category } }) {
  const page = yield select(getPage.bind(null, category));
  const model = yield select(getModel.bind(null, category));
  const query = yield select(getQuery.bind(null, category));
  const __t = yield select(getCategory.bind(null, category));
  if (query.q) {
    query.$text = { $search: query.q };
  }
  if (query.type) {
    query.category = query.type;
  }
  if (query.awards) {
    query.awards = { $ne: null };
    query.$where = 'this.awards.length>0';
  } else {
    delete query.awards;
  }
  if (query.rating) {
    const ranges = reduce(
      query.rating.sort(),
      (result, rating) =>
        result.$gte.push(rating - 0.5) &&
        result.$lt.push(parseInt(rating, 10) + 0.5) &&
        result,
      {
        $gte: [],
        $lt: [],
      }
    );
    query.$or = chunk(xor(ranges.$gte, ranges.$lt).sort(), 2).map(
      ([$gte, $lt]) => {
        const result = { rating: { $gte, $lt } };
        if ($gte === 0.5) delete result.rating.$gte;
        if ($lt === 5.5) delete result.rating.$lt;
        return result;
      }
    );
    delete query.rating;
  }

  if (query.thc) {
    query.thcHigh = { $gte: Number(query.thc[0]), $lte: Number(query.thc[1]) };
    delete query.thc;
  }

  if (query.cbd) {
    query.cbdLow = { $gte: Number(query.cbd[0]) };
    query.cbdHigh = { $lte: Number(query.cbd[1]) };
    delete query.cbd;
  }

  if (query.price) {
    query.variants = {
      $elemMatch: {
        price: {
          $gte: Number(query.price[0]) * 100,
          $lte: Number(query.price[1]) * 100,
        },
      },
    };
    delete query.price;
  }

  delete query.q;
  delete query.type;

  try {
    const data = yield call(request, {
      url: `${API_URL}/products?page=${page}&${stringify(
        model
      )}&query=${encodeURI({ ...query, ...{ __t } })}&populate=business`,
    });
    yield put(productsRequestSuccess(category, query.$text, data));
  } catch (error) {
    yield put(productsRequestFailed(category, error));
  }
}

function* ResetQueryRequest({ payload }) {
  yield put(requestProducts(payload, '', {}));
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(RESET_QUERY, ResetQueryRequest),
    takeLatest(GET_PRODUCTS + REQUESTED, ProductsRequest),
    takeLatest(GET_FILTERS + REQUESTED, FiltersRequest),
  ]);
}
