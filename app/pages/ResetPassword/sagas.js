// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';

// ------------------------------------
// Constants
// ------------------------------------
const RESET_PASSWORD = 'Acheev/App/RESET_PASSWORD';

// ------------------------------------
// Actions
// ------------------------------------
export const requestResetPassword = (payload: Object, token: string) => ({
  type: RESET_PASSWORD + REQUESTED,
  payload,
  meta: token,
});
const resetPasswordRequestSuccess = (payload: Object) => ({
  type: RESET_PASSWORD + SUCCEDED,
  payload,
});
const resetPasswordRequestFailed = error => ({
  type: RESET_PASSWORD + FAILED,
  payload: error,
});
const resetPasswordRequestError = error => ({
  type: RESET_PASSWORD + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
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
function* ResetPasswordRequest({ payload, meta }) {
  try {
    const response = yield call(axios, {
      method: 'POST',
      url: `${API_URL}/auth/reset/${meta}`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(resetPasswordRequestSuccess(response.data));
    } else {
      yield put(resetPasswordRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(resetPasswordRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield [takeLatest(RESET_PASSWORD + REQUESTED, ResetPasswordRequest)];
}
