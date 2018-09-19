// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import type { Map } from 'immutable';
import { call, put, takeLatest } from 'redux-saga/effects';
import { isEmpty } from 'lodash-es';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, STARTED, SUCCEDED, FAILED } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';

// ------------------------------------
// Constants
// ------------------------------------
const CATEGORIES = 'Lift/Forum/CATEGORIES';
const QUESTIONS = 'Lift/Forum/QUESTIONS';
// ------------------------------------
// Actions
// ------------------------------------
export const requestCategories = (slug?: string) => ({
  type: CATEGORIES + REQUESTED,
  payload: { slug },
});
const startCategoriesRequest = () => ({
  type: CATEGORIES + STARTED,
});
const categoriesRequestSuccess = (data: Object) => ({
  type: CATEGORIES + SUCCEDED,
  payload: data,
});
const categoriesRequestFailed = (error: string) => ({
  type: CATEGORIES + FAILED,
  payload: error,
});

export const requestQuestions = (filter: Map<string, string>) => ({
  type: QUESTIONS + REQUESTED,
  payload: {
    filter,
  },
});
const questionsRequestSuccess = (data: Object) => ({
  type: QUESTIONS + SUCCEDED,
  payload: data,
});
const questionsRequestFailed = (error: string) => ({
  type: QUESTIONS + FAILED,
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
  questions: {
    data: [],
    isLoading: true,
  },
});

let newState = null;

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case CATEGORIES + STARTED:
      return state.setIn(['categories', 'isLoading'], true);

    case CATEGORIES + SUCCEDED:
      newState = state
        .setIn(['categories', 'isLoading'], false)
        .setIn(['categories', 'data'], fromJS(payload.data));
      return newState.setIn(
        ['categories', 'data', 'hits'],
        newState
          .getIn(['categories', 'data', 'hits'])
          .sortBy(item => item.get('name'))
      );
    case CATEGORIES + FAILED:
      return state.setIn(['categories', 'isLoading'], false);

    case QUESTIONS + REQUESTED:
      return state.setIn(['questions', 'isLoading'], true);
    case QUESTIONS + SUCCEDED:
      return state
        .setIn(['questions', 'isLoading'], false)
        .setIn(['questions', 'data'], fromJS(payload.data));
    case QUESTIONS + FAILED:
      return state.setIn(['questions', 'isLoading'], false);

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
    const select = '["name", "slug", "description", "bannerPhoto"]';
    const data = yield call(request, {
      url: `${API_URL}/knowledge-base/categories?select=${select}`,
    });
    yield put(categoriesRequestSuccess(data));
  } catch (error) {
    yield put(categoriesRequestFailed(error));
  }
}

function* QuestionsRequest({ payload: { filter } }) {
  let query = {};
  let url;
  try {
    const questionState = filter.get('questionState');
    if (questionState !== 'all') {
      query = {
        correctAnswer: {
          $exists: questionState !== 'open',
        },
      };
    }

    if (filter.get('category') !== 'all') {
      query.category = filter.get('category');
    }

    if (!isEmpty(query)) {
      query = encodeURI(query);
      url = `${API_URL}/knowledge-base/questions?query=${query}&sort=${filter.get(
        'sort'
      )}&page=${filter.get('page')}&populate=answers,user`;
    } else {
      url = `${API_URL}/knowledge-base/questions?sort=${filter.get(
        'sort'
      )}&page=${filter.get('page')}&populate=answers,user`;
    }
    const data = yield call(request, { url });

    yield put(questionsRequestSuccess(data));
  } catch (error) {
    yield put(questionsRequestFailed(error));
  }
}

export default function*(): Saga<void> {
  yield [
    takeLatest(QUESTIONS + REQUESTED, QuestionsRequest),
    takeLatest(CATEGORIES + REQUESTED, CategoriesRequest),
  ];
}
