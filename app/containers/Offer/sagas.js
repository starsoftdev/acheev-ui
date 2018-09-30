// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import {
  call,
  put,
  takeLatest,
  takeEvery,
  select,
  all,
} from 'redux-saga/effects';
import axios from 'axios';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { cloneDeep } from 'lodash-es';

import { getToken, getUserId } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const CREATE_OFFER = 'Acheev/Offer/CREATE_OFFER';
const UPLOAD_OFFER_PHOTOS = 'Acheev/Offer/UPLOAD_REVIEW_PHOTOS';
// ------------------------------------
// Actions
// ------------------------------------
export const requestCreateOffer = (payload: Object) => ({
  type: CREATE_OFFER + REQUESTED,
  payload,
});
const createOfferRequestSuccess = (payload: Object) => ({
  type: CREATE_OFFER + SUCCEDED,
  payload,
});
const createOfferRequestFailed = error => ({
  type: CREATE_OFFER + FAILED,
  payload: error,
});
const createOfferRequestError = error => ({
  type: CREATE_OFFER + ERROR,
  payload: error,
});

export const requestOfferPhotoUpload = (payload: Object) => ({
  type: UPLOAD_OFFER_PHOTOS + REQUESTED,
  payload,
});
const offerPhotoUploadSuccess = (payload: Object) => ({
  type: UPLOAD_OFFER_PHOTOS + SUCCEDED,
  payload,
});
const offerPhotoUploadFailed = error => ({
  type: UPLOAD_OFFER_PHOTOS + FAILED,
  payload: error,
});
const offerPhotoUploadError = error => ({
  type: UPLOAD_OFFER_PHOTOS + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  isLoading: false,
  error: '',
  uploadedPhotos: [],
  isUploading: false,
  uploadError: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case CREATE_OFFER + REQUESTED:
      return state.set('isLoading', true);

    case CREATE_OFFER + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case CREATE_OFFER + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case CREATE_OFFER + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case UPLOAD_OFFER_PHOTOS + REQUESTED:
      return state.set('isUploading', true).set('uploadError', null);

    case UPLOAD_OFFER_PHOTOS + SUCCEDED: {
      const uploadedPhotos = state.get('uploadedPhotos');

      return state
        .set('isUploading', false)
        .set('uploadedPhotos', [...uploadedPhotos, ...payload])
        .set('uploadError', '');
    }

    case UPLOAD_OFFER_PHOTOS + FAILED:
      return state.set('isUploading', false).set('uploadError', payload);

    case UPLOAD_OFFER_PHOTOS + ERROR:
      return state
        .set('isUploading', false)
        .set(
          'uploadError',
          `Something went wrong. Please try again later or contact support and provide the following error information: ${payload}`
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
function* CreateOfferRequest({ payload }) {
  const token = yield select(getToken);
  const userId = yield select(getUserId);
  const data = cloneDeep(payload);
  if (data.gallery) {
    const photos = data.gallery.map((photo, index) => ({
      src: photo,
      alt: 'offer thumbnail',
      position: index,
    }));
    data.gallery = photos;
  }
  try {
    const response = yield call(axios, {
      method: 'POST',
      url: `${API_URL}/offer/user/${userId}`,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(createOfferRequestSuccess(response.data));
    } else {
      yield put(createOfferRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(createOfferRequestError(error));
  }
}

function* UploadOfferPhotoRequest({ payload }) {
  const token = yield select(getToken);
  const userId = yield select(getUserId);
  try {
    const response = yield call(axios, {
      method: 'POST',
      url: `${API_URL}/offer/user/${userId}/thumbnails`,
      data: {
        thumbnails: payload,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(offerPhotoUploadSuccess(response.data));
    } else {
      yield put(offerPhotoUploadFailed(response.data.message));
    }
  } catch (error) {
    yield put(offerPhotoUploadError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(CREATE_OFFER + REQUESTED, CreateOfferRequest),
    takeEvery(UPLOAD_OFFER_PHOTOS + REQUESTED, UploadOfferPhotoRequest),
  ]);
}
