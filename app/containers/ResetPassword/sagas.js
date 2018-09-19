// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import storage from 'store';
import { fromJS } from 'immutable';
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';

// ------------------------------------
// Constants
// ------------------------------------
const RESET_PASSWORD = 'Lift/App/RESET_PASSWORD';

// ------------------------------------
// Actions
// ------------------------------------
export const requestReset = (payload: Object) => ({
  type: RESET_PASSWORD + REQUESTED,
  payload,
});
const requestResetSuccess = (payload: Object) => ({
  type: RESET_PASSWORD + SUCCEDED,
  payload,
});
const requestResetFailed = error => ({
  type: RESET_PASSWORD + FAILED,
  payload: error,
});
const requestResetError = error => ({
  type: RESET_PASSWORD + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  user: fromJS(storage.get('user')),
  token: storage.get('token'),
  isLoading: false,
  error: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case RESET_PASSWORD + REQUESTED:
      return state.set('isLoading', true);

    case RESET_PASSWORD + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('success', payload.message)
        .set('error', '');

    case RESET_PASSWORD + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case RESET_PASSWORD + ERROR:
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
function* ResetRequest({ payload }) {
  const data = { email: payload.email };
  try {
    const response = yield call(axios, {
      method: 'POST',
      url: `${API_URL}/users/password-reset`,
      data,
    });
    if (response.status === 200) {
      yield put(requestResetSuccess(response.data));
    } else {
      yield put(requestResetFailed(response.data.message));
    }
  } catch (error) {
    yield put(requestResetError(error));
  }
}

export default function*(): Saga<void> {
  yield [takeLatest(RESET_PASSWORD + REQUESTED, ResetRequest)];
}
