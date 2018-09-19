// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { history } from 'components/ConnectedRouter';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import deepReplaceTostring from 'utils/deepReplaceToString';
import {
  API_URL,
  REQUESTED,
  STARTED,
  SUCCEDED,
  FAILED,
  ERROR,
} from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken } from 'containers/App/selectors';
import AnalyticsEvents from 'enum/analytics/events';
import CONFIG from 'conf';

// ------------------------------------
// Constants
// ------------------------------------
const GET_CATEGORIES = 'Lift/Question/GET_CATEGORIES';
const POST_QUESTION = 'Lift/Question/POST_QUESTION';

// ------------------------------------
// Actions
// ------------------------------------
export const requestCategories = () => ({
  type: GET_CATEGORIES + REQUESTED,
});
const startCategoriesRequest = () => ({
  type: GET_CATEGORIES + STARTED,
});
const categoriesRequestSuccess = (data: Object) => ({
  type: GET_CATEGORIES + SUCCEDED,
  payload: data,
});
const categoriesRequestFailed = (error: string) => ({
  type: GET_CATEGORIES + FAILED,
  payload: error,
});

export const requestCreateQuestion = (data: Object) => ({
  type: POST_QUESTION + REQUESTED,
  payload: data,
});
const createQuestionSuccess = (response: Object, category: string) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.CREATE_QUESTION, {
      category,
    });
  }
  return {
    type: POST_QUESTION + SUCCEDED,
    payload: response,
  };
};

const createQuestionError = (error: string) => ({
  type: POST_QUESTION + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  categories: {
    isLoading: true,
    data: {},
  },
  questionForm: {
    isLoading: false,
    error: '',
    data: {},
  },
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case GET_CATEGORIES + STARTED:
      return state.setIn(['categories', 'isLoading'], true);

    case GET_CATEGORIES + SUCCEDED:
      return state
        .setIn(['categories', 'isLoading'], false)
        .setIn(['categories', 'data'], fromJS(payload.data));

    case GET_CATEGORIES + FAILED:
      return state.setIn(['categories', 'isLoading'], false);

    case POST_QUESTION + REQUESTED:
      return state.setIn(['questionForm', 'isLoading'], true);

    case POST_QUESTION + SUCCEDED:
      return state
        .setIn(['questionForm', 'isLoading'], false)
        .setIn(['questionForm', 'error'], '')
        .setIn(['questionForm', 'data'], fromJS(payload.data));

    case POST_QUESTION + ERROR:
      return state
        .setIn(['questionForm', 'isLoading'], false)
        .setIn(['questionForm', 'error'], fromJS(payload.message));

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------

// ------------------------------------
// Sagas
// ------------------------------------
function* CategoriesRequest() {
  try {
    yield put(startCategoriesRequest());
    const query = '["name", "slug", "description", "bannerPhoto"]';
    const data = yield call(request, {
      url: `${API_URL}/knowledge-base/categories?select=${query}`,
    });
    yield put(categoriesRequestSuccess(data));
  } catch (error) {
    yield put(categoriesRequestFailed(error));
  }
}

function* CreateQuestionRequest({ payload }) {
  try {
    const token = yield select(getToken);
    const data = deepReplaceTostring(payload);
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/knowledge-base/questions`,
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
    if (response.status === 200) {
      const { slug, category } = response.data;
      const categorySlug = yield call(request, {
        url: `${API_URL}/knowledge-base/categories/${category}?select=slug`,
      });
      yield put(createQuestionSuccess(response, categorySlug));
      if (categorySlug.status === 200) {
        const url = `/forum/${categorySlug.data.slug}/${slug}`;
        history.push(url);
      } else {
        yield put(createQuestionError(categorySlug.data));
      }
    } else {
      yield put(createQuestionError(response.data));
    }
  } catch (error) {
    yield put(createQuestionError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(POST_QUESTION + REQUESTED, CreateQuestionRequest),
    takeLatest(GET_CATEGORIES + REQUESTED, CategoriesRequest),
  ]);
}
