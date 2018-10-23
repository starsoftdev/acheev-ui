// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken, getUserId } from 'containers/App/selectors';
// ------------------------------------
// Constants
// ------------------------------------
const PRESIGNED_URL = 'Acheev/Message/PRESIGNED_URL';
const CHANNELS = 'Acheev/Message/CHANNELS';
// ------------------------------------
// Actions
// ------------------------------------
export const requestIoTPresignedURL = () => ({
  type: PRESIGNED_URL + REQUESTED,
});
const IoTPresignedURLRequestSuccess = (payload: Object) => ({
  type: PRESIGNED_URL + SUCCEDED,
  payload,
});
const IoTPresignedURLRequestFailed = error => ({
  type: PRESIGNED_URL + FAILED,
  payload: error,
});
const IoTPresignedURLRequestError = error => ({
  type: PRESIGNED_URL + ERROR,
  payload: error,
});
export const requestChannels = () => ({
  type: CHANNELS + REQUESTED,
});
const channelsRequestSuccess = (payload: Object) => ({
  type: CHANNELS + SUCCEDED,
  payload,
});
const channelsRequestFailed = error => ({
  type: CHANNELS + FAILED,
  payload: error,
});
const channelsRequestError = error => ({
  type: CHANNELS + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  presignedURL: '',
  isLoading: false,
  error: '',
  channels: [],
  isChannelsLoading: false,
  channelsError: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case PRESIGNED_URL + REQUESTED:
      return state.set('isLoading', true);

    case PRESIGNED_URL + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('presignedURL', payload)
        .set('error', '');

    case PRESIGNED_URL + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case PRESIGNED_URL + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case CHANNELS + REQUESTED:
      return state.set('isChannelsLoading', true);

    case CHANNELS + SUCCEDED:
      return state
        .set('isChannelsLoading', false)
        .set('channels', fromJS(payload))
        .set('channelsError', '');

    case CHANNELS + FAILED:
      return state
        .set('isChannelsLoading', false)
        .set('channelsError', payload);

    case CHANNELS + ERROR:
      return state.set('isChannelsLoading', false).set(
        'channelsError',
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
function* PresignedURLRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(axios, {
      method: 'GET',
      url: `${API_URL}/chat/iot-presigned?protocol=wss`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(IoTPresignedURLRequestSuccess(response.data));
    } else {
      yield put(IoTPresignedURLRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(IoTPresignedURLRequestError(error));
  }
}

function* ChannelsRequest() {
  const token = yield select(getToken);
  const userId = yield select(getUserId);
  try {
    const response = yield call(axios, {
      method: 'GET',
      url: `${API_URL}/chat/channel/user/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(channelsRequestSuccess(response.data));
    } else {
      yield put(channelsRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(channelsRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(PRESIGNED_URL + REQUESTED, PresignedURLRequest),
    takeLatest(CHANNELS + REQUESTED, ChannelsRequest),
  ]);
}
