// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { put, call, takeEvery, all } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import client from 'utils/contentful';
import {
  API_URL,
  REQUESTED,
  SUCCEDED,
  FAILED,
  CONTENT_TYPES,
} from 'enum/constants';
import type { Action, State } from 'types/common';
import { filter, uniqBy } from 'lodash-es';
import CONFIG from 'conf';
import request from 'utils/request';

// ------------------------------------
// Constants
// ------------------------------------
const HOMEPAGE = 'Lift/c101/HOMEPAGE';
const CHAPTERS = 'Lift/c101/CHAPTERS';
const CTA = 'Lift/c101/CTA';
const CHECK_EMAIL = 'Lift/c101/CHECK_EMAIL';
const PDF = 'Lift/c101/PDF';

// ------------------------------------
// Actions
// ------------------------------------
export const requestHomepage = () => ({
  type: HOMEPAGE + REQUESTED,
});
const homepageRequestSuccess = (data: Object) => ({
  type: HOMEPAGE + SUCCEDED,
  payload: data,
});
const homepageRequestFailed = error => ({
  type: HOMEPAGE + FAILED,
  payload: error,
});

export const requestChapters = () => ({
  type: CHAPTERS + REQUESTED,
});
const chaptersRequestSuccess = (data: Object) => ({
  type: CHAPTERS + SUCCEDED,
  payload: data,
});
const chaptersRequestFailed = error => ({
  type: CHAPTERS + FAILED,
  payload: error,
});

export const requestCTA = () => ({
  type: CTA + REQUESTED,
});
const ctaRequestSuccess = (data: Object) => ({
  type: CTA + SUCCEDED,
  payload: data,
});
const ctaRequestFailed = error => ({
  type: CTA + FAILED,
  payload: error,
});

export const requestCheckEmail = (email: string, newsletters: boolean) => ({
  type: CHECK_EMAIL + REQUESTED,
  payload: { email, newsletters },
});
const checkEmailRequestSuccess = () => ({
  type: CHECK_EMAIL + SUCCEDED,
});
const checkEmailRequestFailed = error => ({
  type: CHECK_EMAIL + FAILED,
  payload: error,
});

export const requestPDF = () => ({
  type: PDF + REQUESTED,
});
const pdfRequestSuccess = (data: Object) => ({
  type: PDF + SUCCEDED,
  payload: data,
});
const pdfRequestFailed = error => ({
  type: PDF + FAILED,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  homepage: {
    isLoading: false,
    data: null,
  },
  chapters: {
    isLoading: false,
    data: null,
  },
  cta: {
    isLoading: false,
    data: null,
  },
  email: {
    isLoading: false,
    success: null,
    error: null,
  },
  pdf: {
    isLoading: false,
    data: null,
  },
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case HOMEPAGE + REQUESTED:
      return state.setIn(['homepage', 'isLoading'], true);
    case HOMEPAGE + SUCCEDED:
      return state
        .setIn(['homepage', 'isLoading'], false)
        .setIn(['homepage', 'data'], fromJS(payload.items));
    case HOMEPAGE + FAILED:
      return state.setIn(['homepage', 'isLoading'], false);

    case CHAPTERS + REQUESTED:
      return state.setIn(['chapters', 'isLoading'], true);
    case CHAPTERS + SUCCEDED: {
      const articles = payload;
      const chapters = uniqBy(
        articles.map(item => item.fields.chapter),
        'sys.id'
      );
      const chaptersWithArticles = chapters.map(item => {
        const chapterId = item.sys.id;
        const articlesInCurrentChapter = filter(
          articles,
          o => o.fields.chapter && o.fields.chapter.sys.id === chapterId
        );
        const chapterWithArticles = {
          ...item,
          fields: {
            ...item.fields,
            articles: articlesInCurrentChapter,
          },
        };
        return chapterWithArticles;
      });
      return state
        .setIn(['chapters', 'isLoading'], false)
        .setIn(['chapters', 'data'], fromJS(chaptersWithArticles));
    }
    case CHAPTERS + FAILED:
      return state.setIn(['chapters', 'isLoading'], false);

    case CTA + REQUESTED:
      return state.setIn(['cta', 'isLoading'], true);
    case CTA + SUCCEDED:
      return state
        .setIn(['cta', 'isLoading'], false)
        .setIn(['cta', 'data'], fromJS(payload));
    case CTA + FAILED:
      return state.setIn(['cta', 'isLoading'], false);

    case PDF + REQUESTED:
      return state.setIn(['pdf', 'isLoading'], true);

    case PDF + SUCCEDED:
      return state
        .setIn(['pdf', 'isLoading'], false)
        .setIn(['pdf', 'data'], fromJS(payload));

    case PDF + FAILED:
      return state.setIn(['pdf', 'isLoading'], false);

    case CHECK_EMAIL + REQUESTED:
      return state.setIn(['email', 'isLoading'], true);

    case CHECK_EMAIL + SUCCEDED:
      return state
        .setIn(['email', 'isLoading'], false)
        .setIn(['email', 'success'], true);

    case CHECK_EMAIL + FAILED:
      return state
        .setIn(['email', 'isLoading'], false)
        .setIn(['email', 'error'], payload);

    default:
      return state;
  }
};

// ------------------------------------
// Sagas
// ------------------------------------

function* HomepageRequest() {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const response = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.C101HOMEPAGE,
      });
      yield put(homepageRequestSuccess(response));
    }
  } catch (error) {
    yield put(homepageRequestFailed());
  }
}

function* ChaptersRequest() {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const response = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.C101ARTICLE,
        order: 'sys.createdAt',
        include: 2,
      });
      yield put(chaptersRequestSuccess(response.items));
    }
  } catch (error) {
    yield put(chaptersRequestFailed());
  }
}

function* CTArequest() {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const response = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.C101CTA,
      });
      yield put(ctaRequestSuccess(response.items));
    }
  } catch (error) {
    yield put(ctaRequestFailed());
  }
}

function* PDFrequest() {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const response = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.PDF,
      });
      yield put(pdfRequestSuccess(response));
    }
  } catch (error) {
    yield put(pdfRequestFailed());
  }
}

function* CheckEmailRequest({ payload: { email, newsletters } }) {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const response = yield call(request, {
        method: 'POST',
        url: `${API_URL}/users/register-download`,
        data: { email, newsletters },
      });
      if (response.data.success) {
        yield put(checkEmailRequestSuccess());
      } else {
        yield put(
          checkEmailRequestFailed(
            response.data.message ||
              'Something went wrong. Please try again or contact support.'
          )
        );
      }
    }
  } catch (error) {
    yield put(checkEmailRequestFailed('Request error. Please try again.'));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeEvery(HOMEPAGE + REQUESTED, HomepageRequest),
    takeEvery(CHAPTERS + REQUESTED, ChaptersRequest),
    takeEvery(CTA + REQUESTED, CTArequest),
    takeEvery(PDF + REQUESTED, PDFrequest),
    takeEvery(CHECK_EMAIL + REQUESTED, CheckEmailRequest),
  ]);
}
