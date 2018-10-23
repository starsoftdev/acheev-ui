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
const CLIENT_TOKEN = 'Acheev/Checkout/CLIENT_TOKEN';
const PAYMENT = 'Acheev/Checkout/PAYMENT';
// ------------------------------------
// Actions
// ------------------------------------
export const requestClientToken = () => ({
  type: CLIENT_TOKEN + REQUESTED,
});
const clientTokenRequestSuccess = (payload: Object) => ({
  type: CLIENT_TOKEN + SUCCEDED,
  payload,
});
const clientTokenRequestFailed = error => ({
  type: CLIENT_TOKEN + FAILED,
  payload: error,
});
const clientTokenRequestError = error => ({
  type: CLIENT_TOKEN + ERROR,
  payload: error,
});

export const requestPayment = (payload: Object) => ({
  type: PAYMENT + REQUESTED,
  payload,
});
const paymentRequestSuccess = (payload: Object) => ({
  type: PAYMENT + SUCCEDED,
  payload,
});
const paymentRequestFailed = error => ({
  type: PAYMENT + FAILED,
  payload: error,
});
const paymentRequestError = error => ({
  type: PAYMENT + ERROR,
  payload: error,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  clientToken: '',
  isLoading: false,
  error: '',
  isPaymentSending: false,
  paymentError: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case CLIENT_TOKEN + REQUESTED:
      return state.set('isLoading', true);

    case CLIENT_TOKEN + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('clientToken', payload.clientToken)
        .set('error', '');

    case CLIENT_TOKEN + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case CLIENT_TOKEN + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case PAYMENT + REQUESTED:
      return state.set('isPaymentSending', true);

    case PAYMENT + SUCCEDED:
      return state.set('isPaymentSending', false).set('paymentError', '');

    case PAYMENT + FAILED:
      return state.set('isPaymentSending', false).set('paymentError', payload);

    case PAYMENT + ERROR:
      return state.set('isPaymentSending', false).set(
        'paymentError',
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
function* ClientTokenRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(axios, {
      method: 'GET',
      url: `${API_URL}/payment/clientToken`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(clientTokenRequestSuccess(response.data));
    } else {
      yield put(clientTokenRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(clientTokenRequestError(error));
  }
}

function* PaymentSendRequest({ payload }) {
  const token = yield select(getToken);
  const userId = yield select(getUserId);
  try {
    const response = yield call(axios, {
      method: 'POST',
      url: `${API_URL}/payment/user/${userId}/sendTo`,
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      const response1 = yield call(axios, {
        method: 'POST',
        url: `${API_URL}/chat/channel`,
        data: {
          subscribers: [userId, payload.to],
          type: 'one-to-one',
          messages: [],
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response1.status === 200) {
        yield put(paymentRequestSuccess(response.data));
      } else {
        yield put(paymentRequestFailed(response1.data.error));
      }
    } else {
      yield put(paymentRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(paymentRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(CLIENT_TOKEN + REQUESTED, ClientTokenRequest),
    takeLatest(PAYMENT + REQUESTED, PaymentSendRequest),
  ]);
}
