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
const MEMBER_SERVICES = 'Acheev/Member/MEMBER_SERVICES';
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

export const requestMemberServices = (userId: string) => ({
  type: MEMBER_SERVICES + REQUESTED,
  payload: userId,
});
const memberServicesRequestSuccess = (payload: Object) => ({
  type: MEMBER_SERVICES + SUCCEDED,
  payload,
});
const memberServicesRequestFailed = error => ({
  type: MEMBER_SERVICES + FAILED,
  payload: error,
});
const memberServicesRequestError = error => ({
  type: MEMBER_SERVICES + ERROR,
  payload: error,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  data: {},
  isLoading: false,
  error: '',
  services: [],
  isServiceLoading: false,
  serviceError: '',
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

    case MEMBER_SERVICES + REQUESTED:
      return state.set('isServiceLoading', true);

    case MEMBER_SERVICES + SUCCEDED:
      return state
        .set('isServiceLoading', false)
        .set('serviceError', '')
        .set('services', fromJS(payload));

    case MEMBER_SERVICES + FAILED:
      return state.set('isServiceLoading', false).set('serviceError', payload);

    case MEMBER_SERVICES + ERROR:
      return state.set('isServiceLoading', false).set(
        'serviceError',
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

function* MemberProfileRequest({ payload }) {
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

function* MemberServicesRequest({ payload }) {
  try {
    const response = yield call(axios, {
      method: 'GET',
      url: `${API_URL}/offer/user/${payload}`,
    });
    if (response.status === 200) {
      yield put(memberServicesRequestSuccess(response.data));
    } else {
      yield put(memberServicesRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(memberServicesRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(MEMBER_PROFILE + REQUESTED, MemberProfileRequest),
    takeLatest(MEMBER_SERVICES + REQUESTED, MemberServicesRequest),
  ]);
}
