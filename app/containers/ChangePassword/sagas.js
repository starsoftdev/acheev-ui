// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { history } from 'components/ConnectedRouter';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const CHANGE_PASSWORD = 'Lift/App/CHANGE_PASSWORD';

// ------------------------------------
// Actions
// ------------------------------------
export const requestChange = (payload: Object, token: string) => ({
  type: CHANGE_PASSWORD + REQUESTED,
  payload,
  token,
});
const requestChangeSuccess = (payload: Object) => ({
  type: CHANGE_PASSWORD + SUCCEDED,
  payload,
});
const requestChangeFailed = error => ({
  type: CHANGE_PASSWORD + FAILED,
  payload: error,
});
const requestChangeError = error => ({
  type: CHANGE_PASSWORD + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  isLoading: false,
  error: '',
  success: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case CHANGE_PASSWORD + REQUESTED:
      return state.set('isLoading', true);

    case CHANGE_PASSWORD + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('success', `Successfully changed password for ${payload.username}`)
        .set('error', '');

    case CHANGE_PASSWORD + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case CHANGE_PASSWORD + ERROR:
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
function* ChangeRequest({ payload, token }) {
  const authToken = yield select(getToken);
  const data = { password: payload.password };
  try {
    const response = yield call(axios, {
      method: 'PUT',
      url: `${API_URL}/users/me/password${authToken ? '' : `?token=${token}`}`,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : null,
      data,
    });
    if (response.status === 200) {
      yield put(requestChangeSuccess(response.data));
      history.push('/me');
    } else {
      yield put(requestChangeFailed(response.data.message));
    }
  } catch (error) {
    yield put(requestChangeError(error));
  }
}

export default function*(): Saga<void> {
  yield [takeLatest(CHANGE_PASSWORD + REQUESTED, ChangeRequest)];
}
