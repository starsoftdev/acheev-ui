// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { cloneDeep } from 'lodash-es';

import { getToken, getUserId } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const SEARCH_OFFERS = 'Acheev/Offer/SEARCH_OFFERS';
const GET_OFFER = 'Acheev/Offer/GET_OFFER';
const CREATE_OFFER = 'Acheev/Offer/CREATE_OFFER';
const UPLOAD_OFFER_PHOTOS = 'Acheev/Offer/UPLOAD_REVIEW_PHOTOS';
const ORDER_OFFER = 'Acheev/Offer/ORDER_OFFER';
const SET_PARAMS = 'Acheev/Offer/SET_PARAMS';
const CHANGE_PARAM = 'Acheev/Offer/CHANGE_PARAM';
// ------------------------------------
// Actions
// ------------------------------------
export const requestSearchOffers = () => ({
  type: SEARCH_OFFERS + REQUESTED,
});
const offersSearchRequestSuccess = (payload: Object) => ({
  type: SEARCH_OFFERS + SUCCEDED,
  payload,
});
const offersSearchRequestFailed = error => ({
  type: SEARCH_OFFERS + FAILED,
  payload: error,
});
const offersSearchRequestError = error => ({
  type: SEARCH_OFFERS + ERROR,
  payload: error,
});
export const requestOffer = (id: string) => ({
  type: GET_OFFER + REQUESTED,
  payload: id,
});
const offerRequestSuccess = (payload: Object) => ({
  type: GET_OFFER + SUCCEDED,
  payload,
});
const offerRequestFailed = error => ({
  type: GET_OFFER + FAILED,
  payload: error,
});
const offerRequestError = error => ({
  type: GET_OFFER + ERROR,
  payload: error,
});
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

export const requestOrderOffer = (payload: Object) => ({
  type: ORDER_OFFER,
  payload,
});
export const setParams = (params: Object) => ({
  type: SET_PARAMS,
  payload: params,
});

export const changeParam = (path: string, value: any) => ({
  type: CHANGE_PARAM,
  payload: value,
  meta: {
    path,
  },
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  data: {},
  params: {},
  isLoading: false,
  error: '',
  uploadedPhotos: [],
  isUploading: false,
  uploadError: '',
  offer: {},
  checkout: {},
});

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case SEARCH_OFFERS + REQUESTED:
      return state.set('isLoading', true);

    case SEARCH_OFFERS + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('error', '')
        .set('data', fromJS(payload));

    case SEARCH_OFFERS + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case SEARCH_OFFERS + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case GET_OFFER + REQUESTED:
      return state.set('isLoading', true);

    case GET_OFFER + SUCCEDED: {
      const checkout = cloneDeep(payload);
      checkout.extra_services = [];
      return state
        .set('isLoading', false)
        .set('error', '')
        .set('offer', fromJS(payload))
        .set('checkout', fromJS(checkout));
    }

    case GET_OFFER + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case GET_OFFER + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

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

    case ORDER_OFFER:
      return state.set('checkout', fromJS(payload));

    case SET_PARAMS: {
      const { cat = 'all', page = 1, perPage = 2, ...otherKeys } = payload;
      return state.set(
        'params',
        fromJS({
          cat,
          page,
          per_page: perPage,
          ...otherKeys,
        })
      );
    }

    case CHANGE_PARAM:
      return state.setIn(['params', meta.path], payload);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getParams = state => state.getIn(['offer', 'params']).toJS();
// ------------------------------------
// Sagas
// ------------------------------------
function* OffersSearchRequest() {
  const params = yield select(getParams);
  try {
    const response = yield call(axios, {
      method: 'GET',
      url: `${API_URL}/offer?page=${params.page - 1}&limit=${params.per_page}`,
    });
    if (response.status === 200) {
      yield put(offersSearchRequestSuccess(response.data));
    } else {
      yield put(offersSearchRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(offersSearchRequestError(error));
  }
}

function* OfferRequest({ payload }) {
  try {
    const response = yield call(axios, {
      method: 'GET',
      url: `${API_URL}/offer/${payload}`,
    });
    if (response.status === 200) {
      yield put(offerRequestSuccess(response.data));
    } else {
      yield put(offerRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(offerRequestError(error));
  }
}

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
  if (data.extra_services) {
    const services = data.extra_services.map(service => ({
      description: service.description,
      price: service.price,
    }));
    data.extra_services = services;
  }
  if (data.faq) {
    const faqs = data.faq.map(item => ({
      question: item.question,
      answer: item.answer,
    }));
    data.faq = faqs;
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
    takeLatest(SEARCH_OFFERS + REQUESTED, OffersSearchRequest),
    takeLatest(GET_OFFER + REQUESTED, OfferRequest),
    takeLatest(CREATE_OFFER + REQUESTED, CreateOfferRequest),
    takeLatest(UPLOAD_OFFER_PHOTOS + REQUESTED, UploadOfferPhotoRequest),
  ]);
}
