// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import CONFIG from '../../conf';
import { fromJS } from 'immutable';
import { call, put, takeLatest } from 'redux-saga/effects';
import { REQUESTED, SUCCEDED, ERROR } from 'enum/constants';

import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';

import { faqClient } from 'utils/contentful';

// ------------------------------------
// Constants
// ------------------------------------
const FAQ = 'Lift/Faq/FAQ';
const TOPICS = 'Lift/Faq/TOPICS';
const SECTIONS = 'Lift/Faq/SECTIONS';
// ------------------------------------
// Actions
// ------------------------------------

export const requestFaq = (topic: string, query?: string) => ({
  type: FAQ + REQUESTED,
  payload: topic,
  meta: {
    query,
  },
});
const faqRequestSuccess = (payload: Object) => ({
  type: FAQ + SUCCEDED,
  payload,
});
const faqRequestError = error => ({
  type: FAQ + ERROR,
  payload: error,
});

export const requestTopics = () => ({
  type: TOPICS + REQUESTED,
});
const topicsRequestSuccess = (payload: Object) => ({
  type: TOPICS + SUCCEDED,
  payload,
});
const topicsRequestError = error => ({
  type: TOPICS + ERROR,
  payload: error,
});

export const requestSections = () => ({
  type: SECTIONS + REQUESTED,
});
const sectionsRequestSuccess = (payload: Object) => ({
  type: SECTIONS + SUCCEDED,
  payload,
});
const sectionsRequestError = error => ({
  type: SECTIONS + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  data: [],
  isLoading: true,
  error: '',
  topic: null,
  query: '',
  topics: {
    data: [],
    isLoading: true,
    error: '',
  },
  sections: {
    data: [],
    isLoading: true,
    error: '',
  },
});

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  let items;
  let data;
  switch (type) {
    case FAQ + REQUESTED:
      return state
        .set('isLoading', true)
        .set('topic', payload)
        .set('query', meta.query)
        .set('data', []);

    case FAQ + SUCCEDED:
      items = payload.items;
      data = items.map(item => {
        let topicValue = null;
        let sectionValue = null;

        if (item.fields.topic) {
          topicValue = item.fields.topic.fields.value;
        }
        if (item.fields.section) {
          sectionValue = item.fields.section.fields.sectionValue;
        }

        return {
          question: item.fields.question,
          answer: item.fields.answer,
          topic: topicValue,
          section: sectionValue,
        };
      });
      return state
        .set('isLoading', false)
        .set('data', fromJS(data))
        .set('error', '');

    case FAQ + ERROR:
      return state.set('isLoading', false).set('error', payload);

    case TOPICS + REQUESTED:
      return state
        .setIn(['topics', 'isLoading'], true)
        .setIn(['topics', 'error'], '')
        .setIn(['topics', 'data'], []);

    case TOPICS + SUCCEDED:
      items = payload.items;
      data = items.map(item => {
        const label = item.fields.title;
        const { value } = item.fields;
        const icon = item.fields.icon.fields.file.url;
        return { label, value, icon };
      });
      return state
        .setIn(['topics', 'isLoading'], false)
        .setIn(['topics', 'error'], '')
        .setIn(['topics', 'data'], fromJS(data));

    case TOPICS + ERROR:
      return state
        .setIn(['topics', 'isLoading'], false)
        .setIn(['topics', 'error'], 'Something went wrong.');

    case SECTIONS + REQUESTED:
      return state
        .setIn(['sections', 'isLoading'], true)
        .setIn(['sections', 'error'], '')
        .setIn(['sections', 'data'], []);

    case SECTIONS + SUCCEDED:
      items = payload.items;
      data = items.map(item => {
        const label = item.fields.sectionName;
        const value = item.fields.sectionValue;
        return { label, value };
      });
      return state
        .setIn(['sections', 'isLoading'], false)
        .setIn(['sections', 'error'], '')
        .setIn(['sections', 'data'], fromJS(data));

    case SECTIONS + ERROR:
      return state
        .setIn(['sections', 'isLoading'], false)
        .setIn(['sections', 'error'], 'Something went wrong.');

    default:
      return state;
  }
};
// ------------------------------------
// Sagas
// ------------------------------------
function* TopicsRequest() {
  try {

    if (CONFIG.IS_CONTENTFUL) {

    const response = yield call(faqClient.getEntries, {
      content_type: 'topic',
      include: 2,
    });
    yield put(topicsRequestSuccess(response));
    }

  } catch (error) {
    yield put(topicsRequestError(error));
  }
}

function* SectionsRequest() {
  try {

	  if (CONFIG.IS_CONTENTFUL) {

    const response = yield call(faqClient.getEntries, {
      content_type: 'section',
      select: 'fields',
      include: 2,
    });

    yield put(sectionsRequestSuccess(response));
	  }

  } catch (error) {
    yield put(sectionsRequestError(error));
  }
}

function* FaqRequest({ payload, meta }) {
  try {
    const filter: Object = {
      content_type: 'question',
      select: 'fields',
      include: 2,
    };
    if (meta.query) {
      filter.query = meta.query;
    }
    if (payload) {
      filter['fields.topic.sys.contentType.sys.id'] = 'topic';
      filter['fields.topic.fields.value'] = payload;
    } else {
      filter['fields.isFrequent'] = true;
    }

	  if (CONFIG.IS_CONTENTFUL) {

    const response = yield call(faqClient.getEntries, filter);

    yield put(faqRequestSuccess(response));
	  }

  } catch (error) {
    yield put(faqRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield [
    takeLatest(FAQ + REQUESTED, FaqRequest),
    takeLatest(SECTIONS + REQUESTED, SectionsRequest),
    takeLatest(TOPICS + REQUESTED, TopicsRequest),
  ];
}
