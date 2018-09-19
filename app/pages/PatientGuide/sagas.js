// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const PATIENT_GUIDE = 'Lift/App/PATIENT_GUIDE';

// ------------------------------------
// Actions
// ------------------------------------
export const requestPatientGuide = (payload: Object) => ({
  type: PATIENT_GUIDE + REQUESTED,
  payload,
});
const requestPatientGuideSuccess = (payload: Object) => ({
  type: PATIENT_GUIDE + SUCCEDED,
  payload,
});
const requestPatientGuideFailed = error => ({
  type: PATIENT_GUIDE + FAILED,
  payload: error,
});
const requestPatientGuideError = error => ({
  type: PATIENT_GUIDE + ERROR,
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
    case PATIENT_GUIDE + REQUESTED:
      return state
        .set('success', '')
        .set('error', '')
        .set('isLoading', true);

    case PATIENT_GUIDE + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('success', 'Your patient guide has been emailed to you.')
        .set('error', '');

    case PATIENT_GUIDE + FAILED:
      return state
        .set('isLoading', false)
        .set('success', '')
        .set('error', payload);

    case PATIENT_GUIDE + ERROR:
      return state
        .set('isLoading', false)
        .set('success', '')
        .set(
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

function* PatientGuideRequest({ payload }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/patient-guide`,
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
    if (response.status === 200) {
      yield put(requestPatientGuideSuccess(response));
    } else {
      yield put(requestPatientGuideFailed(response.data.message));
    }
  } catch (error) {
    yield put(requestPatientGuideError(error));
  }
}

export default function*(): Saga<void> {
  yield [takeLatest(PATIENT_GUIDE + REQUESTED, PatientGuideRequest)];
}
