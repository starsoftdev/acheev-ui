// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { loginRequestSuccess, userRequestSuccess } from 'containers/App/sagas';

// ------------------------------------
// Constants
// ------------------------------------
const TOKEN_CONFIRMATION = 'Lift/App/TOKEN_CONFIRMATION';

// ------------------------------------
// Actions
// ------------------------------------
export const confirmToken = (token: string) => ({
  type: TOKEN_CONFIRMATION + REQUESTED,
  token,
});
const tokenConfirmationSuccess = (payload: Object) => ({
  type: TOKEN_CONFIRMATION + SUCCEDED,
  payload,
});
const tokenConfirmationFailed = error => ({
  type: TOKEN_CONFIRMATION + FAILED,
  payload: error,
});
const tokenConfirmationError = error => ({
  type: TOKEN_CONFIRMATION + ERROR,
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
    case TOKEN_CONFIRMATION + REQUESTED:
      return state.set('isLoading', true);

    case TOKEN_CONFIRMATION + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case TOKEN_CONFIRMATION + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case TOKEN_CONFIRMATION + ERROR:
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
// Sagas
// ------------------------------------
function* ConfirmRequest({ token }) {
  try {
    const response = yield call(axios, {
      method: 'POST',
      url: `${API_URL}/auth/token-confirmation`,
      data: {
        token,
      },
    });
    if (response.status === 200) {
      yield put(loginRequestSuccess(response.data));
      yield put(userRequestSuccess(response.data));
      yield put(tokenConfirmationSuccess(response.data));
    } else {
      yield put(tokenConfirmationFailed(response.data.message));
    }
  } catch (error) {
    yield put(tokenConfirmationError(error));
  }
}

export default function*(): Saga<void> {
  yield takeLatest(TOKEN_CONFIRMATION + REQUESTED, ConfirmRequest);
}
