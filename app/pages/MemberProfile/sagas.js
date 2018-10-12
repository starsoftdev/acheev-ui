// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';

// ------------------------------------
// Constants
// ------------------------------------
const MEMBER_PROFILE = 'Acheev/Member/MEMBER_PROFILE';
// ------------------------------------
// Actions
// ------------------------------------
export const requestMemberProfile = (username: string) => ({
  type: MEMBER_PROFILE + REQUESTED,
  payload: username,
});
const memberProfileRequestSuccess = (payload: Object) => ({
  type: MEMBER_PROFILE + SUCCEDED,
  payload,
});
const memberProfileRequestFailed = error => ({
  type: MEMBER_PROFILE + FAILED,
  payload: error,
});
const memberProfileRequestError = error => ({
  type: MEMBER_PROFILE + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  data: {},
  isLoading: false,
  error: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case MEMBER_PROFILE + REQUESTED:
      return state.set('isLoading', true);

    case MEMBER_PROFILE + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('error', '')
        .set('data', fromJS(payload));

    case MEMBER_PROFILE + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case MEMBER_PROFILE + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

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

function* OfferRequest({ payload }) {
  try {
    const response = yield call(axios, {
      method: 'GET',
      url: `${API_URL}/user/${payload}`,
    });
    if (response.status === 200) {
      yield put(memberProfileRequestSuccess(response.data));
    } else {
      yield put(memberProfileRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(memberProfileRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([takeLatest(MEMBER_PROFILE + REQUESTED, OfferRequest)]);
}
