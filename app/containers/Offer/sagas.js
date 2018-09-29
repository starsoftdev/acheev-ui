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

import { getToken, getUserId } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const CREATE_OFFER = 'Acheev/Offer/CREATE_OFFER';
const UPLOAD_OFFER_PHOTOS = 'Acheev/Offer/UPLOAD_REVIEW_PHOTOS';
const REMOVE_OFFER_PHOTO = 'Acheev/Offer/REMOVE_REVIEW_PHOTO';
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

export const requestOfferPhotoUpload = (index: number, payload: string) => ({
  type: UPLOAD_OFFER_PHOTOS + REQUESTED,
  payload,
  meta: {
    index,
  },
});
const offerPhotoUploadSuccess = (index: number, payload: Object) => ({
  type: UPLOAD_OFFER_PHOTOS + SUCCEDED,
  payload,
  meta: {
    index,
  },
});
const offerPhotoUploadError = (index, error) => ({
  type: UPLOAD_OFFER_PHOTOS + ERROR,
  payload: error,
  meta: {
    index,
  },
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
  { type, payload, meta }: Action
) => {
  let uploadedPhotos = state.get('uploadedPhotos');
  let isUploading = false;
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
      uploadedPhotos = uploadedPhotos.set(
        meta.index,
        fromJS({ isLoading: true, link: '', error: null })
      );
      return state
        .set('isUploading', true)
        .set('uploadedPhotos', uploadedPhotos)
        .set('uploadError', null);

    case UPLOAD_OFFER_PHOTOS + SUCCEDED:
      uploadedPhotos = uploadedPhotos.set(
        meta.index,
        fromJS({
          isLoading: false,
          link: payload.link,
          error: null,
        })
      );
      uploadedPhotos.forEach(v => {
        isUploading = isUploading || v.get('isLoading', false);
      });
      return state
        .set('isUploading', isUploading)
        .set('uploadedPhotos', uploadedPhotos)
        .set('uploadError', '');

    case UPLOAD_OFFER_PHOTOS + ERROR:
      uploadedPhotos = uploadedPhotos.set(
        meta.index,
        fromJS({
          isLoading: false,
          link: '',
          error: 'error',
        })
      );
      uploadedPhotos.forEach(v => {
        isUploading = isUploading || v.get('isLoading', false);
      });
      return state
        .set('isUploading', false)
        .set('uploadedPhotos', uploadedPhotos)
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
  try {
    const response = yield call(axios, {
      method: 'POST',
      url: `${API_URL}/offer/user/${userId}`,
      data: payload,
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

function* UploadOfferPhotoRequest({ payload, meta: { index } }) {
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
      yield put(offerPhotoUploadSuccess(index, response.data));
    } else {
      yield put(offerPhotoUploadError(index, response.data.message));
    }
  } catch (error) {
    yield put(offerPhotoUploadError(index, error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(CREATE_OFFER + REQUESTED, CreateOfferRequest),
    takeEvery(UPLOAD_OFFER_PHOTOS + REQUESTED, UploadOfferPhotoRequest),
  ]);
}
