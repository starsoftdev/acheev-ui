// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import storage from 'store';
import { fromJS, List } from 'immutable';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import moment from 'moment';
import request from 'utils/request';
import deepReplace from 'utils/deepReplaceToString';
import encodeURI from 'utils/encodeURI';
import {
  API_URL,
  REQUESTED,
  SUCCEDED,
  FAILED,
  ERROR,
  GLOBAL_SEARCH_CATEGORY_ORDER,
  CONTENT_TYPES,
} from 'enum/constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken } from 'containers/App/selectors';
import client from 'utils/contentful';
import AnalyticsEvents from 'enum/analytics/events';
import CONFIG from 'conf';

// ------------------------------------
// Constants
// ------------------------------------
const REGISTER_EMAIL = 'Acheev/App/REGISTER_EMAIL';
const REGISTER = 'Acheev/App/REGISTER';
const LOGIN = 'Acheev/App/LOGIN';
const LOGOUT = 'Acheev/App/LOGOUT';
const RESEND_TOKEN = 'Acheev/App/RESEND_TOKEN';
const CONFIRM_EMAIL = 'Acheev/App/CONFIRM_EMAIL';
const SET_USER_TO_CONFIRM_EMAIL = 'Acheev/App/SET_USER_TO_CONFIRM_EMAIL';
const USER = 'Acheev/App/USER';
const USER_DATA_UPDATE = 'Acheev/App/UPDATE_USER_DATA';
const PAGE_META = 'Acheev/App/PAGE_META';

const OPEN_CART = 'Acheev/App/OPEN_CART';
const CLOSE_CART = 'Acheev/App/CLOSE_CART';
const UPDATE_CART = 'Acheev/App/UPDATE_CART';
const ADD_PRODUCT = 'Acheev/App/Track/ADD_PRODUCT';
const REMOVE_PRODUCT = 'Acheev/App/Track/REMOVE_PRODUCT';
const CHECKOUT_CART = 'Acheev/App/Track/CHECKOUT_CART';
const TRACK_CAMPAIGN = 'Acheev/App/Track/TRACK_CAMPAIGN';

const USER_PHOTO_UPLOAD = 'Acheev/App/UPLOAD_USER_PHOTO';
const SET_PROFILE_BREADCRUMB_PATH = 'Acheev/App/SET_PROFILE_BREADCRUMB_PATH';

const OPEN_NAVBAR = 'Acheev/App/OPEN_NAVBAR';
const CLOSE_NAVBAR = 'Acheev/App/CLOSE_NAVBAR';

const GO_PAGE_STEP1 = 'Acheev/App/Track/GO_PAGE_STEP1';
const SET_META_JSON = 'Acheev/App/SET_META_JSON';

const GLOBAL_SEARCH = 'Acheev/App/GLOBAL_SEARCH';

const REGISTER_INVESTOR = 'Acheev/App/REGISTER_INVESTOR';

const OPEN_MODAL = 'Acheev/App/OPEN_MODAL';
const CLOSE_MODAL = 'Acheev/App/CLOSE_MODAL';

// ------------------------------------
// Actions
// ------------------------------------
export const requestRegisterEmail = (payload: Object) => ({
  type: REGISTER_EMAIL + REQUESTED,
  payload,
});
const registerEmailRequestSuccess = (payload: Object) => ({
  type: REGISTER_EMAIL + SUCCEDED,
  payload,
});
const registerEmailRequestFailed = (error: string) => ({
  type: REGISTER_EMAIL + FAILED,
  payload: error,
});
const registerEmailRequestError = (error: string) => ({
  type: REGISTER_EMAIL + ERROR,
  payload: error,
});
export const requestRegister = (payload: Object, token: string) => ({
  type: REGISTER + REQUESTED,
  payload,
  token,
});
const registerRequestSuccess = (payload: Object) => ({
  type: REGISTER + SUCCEDED,
  payload,
});
const registerRequestFailed = (error: string) => ({
  type: REGISTER + FAILED,
  payload: error,
});
const registerRequestError = (error: string) => ({
  type: REGISTER + ERROR,
  payload: error,
});

export const resendToken = (payload: Object) => ({
  type: RESEND_TOKEN + REQUESTED,
  payload,
});
const resendTokenSuccess = (payload: Object) => ({
  type: RESEND_TOKEN + SUCCEDED,
  payload,
});
const resendTokenFailed = error => ({
  type: RESEND_TOKEN + FAILED,
  payload: error,
});
const resendTokenError = error => ({
  type: RESEND_TOKEN + ERROR,
  payload: error,
});

export const setUserToConfirmEmail = (payload: Object) => ({
  type: SET_USER_TO_CONFIRM_EMAIL,
  payload,
});

export const confirmEmail = (payload: Object, token: string) => ({
  type: CONFIRM_EMAIL + REQUESTED,
  payload,
  meta: {
    token,
  },
});
const confirmEmailSuccess = (payload: Object) => ({
  type: CONFIRM_EMAIL + SUCCEDED,
  payload,
});
const confirmEmailFailed = error => ({
  type: CONFIRM_EMAIL + FAILED,
  payload: error,
});
const confirmEmailError = error => ({
  type: CONFIRM_EMAIL + ERROR,
  payload: error,
});

export const requestUserDataUpdate = (payload: Object) => ({
  type: USER_DATA_UPDATE + REQUESTED,
  payload,
});

const userDataUpdateSuccess = (payload: Object) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.identify(payload.id, {
      name: payload.username,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      gender: payload.gender,
      avatar: payload.gravatarPicture,
      createdAt: moment(payload.createdOn).toDate(),
      birthday: moment(payload.birthday).toDate(),
      description: payload.bio,
      age: moment().diff(moment(payload.birthday), 'years'),
    });
    analytics.track(AnalyticsEvents.EDIT_PROFILE);
  }
  return {
    type: USER_DATA_UPDATE + SUCCEDED,
    payload,
  };
};
const userDataUpdateFailed = error => ({
  type: USER_DATA_UPDATE + FAILED,
  payload: error,
});
const userDataUpdateError = error => ({
  type: USER_DATA_UPDATE + ERROR,
  payload: error,
});

export const requestUserPhotoUpload = (payload: Object) => ({
  type: USER_PHOTO_UPLOAD + REQUESTED,
  payload,
});
const userPhotoUploadSuccess = (payload: Object) => ({
  type: USER_PHOTO_UPLOAD + SUCCEDED,
  payload,
});
const userPhotoUploadFailed = error => ({
  type: USER_PHOTO_UPLOAD + FAILED,
  payload: error,
});
const userPhotoUploadError = error => ({
  type: USER_PHOTO_UPLOAD + ERROR,
  payload: error,
});

export const requestLogin = (payload: Object, type?: string) => ({
  type: LOGIN + REQUESTED,
  payload,
  meta: { type },
});
export const loginRequestSuccess = (payload: Object, type?: string) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.identify(payload.id, {
      name: payload.username,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      gender: payload.gender,
      avatar: payload.gravatarPicture,
      createdAt: moment(payload.createdOn).toDate(),
      birthday: moment(payload.birthday).toDate(),
      description: payload.bio,
      age: moment().diff(moment(payload.birthday), 'years'),
    });
  }
  return {
    type: LOGIN + SUCCEDED,
    payload,
    meta: { type },
  };
};
const loginRequestFailed = (error, type?: string) => ({
  type: LOGIN + FAILED,
  payload: error,
  meta: { type },
});
const loginRequestError = (error, type?: string) => ({
  type: LOGIN + ERROR,
  payload: error,
  meta: { type },
});

export const logout = (type?: string) => ({
  type: LOGOUT,
  meta: { type },
});

export const requestUser = () => ({
  type: USER + REQUESTED,
});
export const userRequestSuccess = (payload: Object) => ({
  type: USER + SUCCEDED,
  payload,
});
const userRequestFailed = (error: string) => ({
  type: USER + FAILED,
  payload: error,
});
const userRequestError = (error: string) => ({
  type: USER + ERROR,
  payload: error,
});

export const openCart = () => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.SHOPPING_CART_OPEN);
  }
  return {
    type: OPEN_CART,
  };
};
export const closeCart = () => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.SHOPPING_CART_CLOSE);
  }
  return {
    type: CLOSE_CART,
  };
};

export const updateCart = (itemCount: number) => ({
  type: UPDATE_CART,
  payload: itemCount,
});

export const trackAddProduct = (product: string) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.SHOPPING_CART_ADD_PRODUCT, {
      product,
    });
  }
  return {
    type: ADD_PRODUCT,
  };
};

export const trackRemoveProduct = (product: string) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.SHOPPING_CART_REMOVE_PRODUCT, {
      product,
    });
  }
  return {
    type: REMOVE_PRODUCT,
  };
};

export const trackCheckout = () => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.SHOPPING_CHECKOUT);
  }
  return {
    type: CHECKOUT_CART,
  };
};

export const trackCampaign = (
  compaignName: string,
  compaignReferrer: string
) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.USER_REGISTERED_CAMPAIGN, {
      compaignName,
      compaignReferrer,
    });
  }
  return {
    type: TRACK_CAMPAIGN,
  };
};

export const setProfileBreadcrumbPath = (path: List<Map<string, Object>>) => ({
  type: SET_PROFILE_BREADCRUMB_PATH,
  payload: path,
});

export const openNavbar = () => ({
  type: OPEN_NAVBAR,
});

export const closeNavbar = () => ({
  type: CLOSE_NAVBAR,
});

export const setMetaJson = (path: string, value: ?Object) => ({
  type: SET_META_JSON,
  payload: value,
  meta: {
    path,
  },
});

export const trackGoStep1 = () => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.GO_PAGE_STEP1);
  }
  return {
    type: GO_PAGE_STEP1,
  };
};

export const requestGlobalSearch = (path: string, value: Object) => ({
  type: GLOBAL_SEARCH + REQUESTED,
  payload: value,
  meta: {
    path,
  },
});
const globalSearchSuccess = (keyword: Object, data: Object) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.GLOBAL_SEARCH, {
      keyword: keyword ? keyword.$search : '',
    });
  }
  return {
    type: GLOBAL_SEARCH + SUCCEDED,
    payload: data,
  };
};
const globalSearchFailed = (error: string) => ({
  type: GLOBAL_SEARCH + FAILED,
  payload: error,
});

export const registerInvestor = (payload: Object) => ({
  type: REGISTER_INVESTOR + REQUESTED,
  payload,
});
const registerInvestorRequestSuccess = (payload: Object) => ({
  type: REGISTER_INVESTOR + SUCCEDED,
  payload,
});
const registerInvestorRequestFailed = error => ({
  type: REGISTER_INVESTOR + FAILED,
  payload: error,
});

export const requestPageMeta = (pathname: string) => ({
  type: PAGE_META + REQUESTED,
  payload: pathname,
});
const pageMetaRequestSuccess = (data: Object) => ({
  type: PAGE_META + SUCCEDED,
  payload: data,
});
const pageMetaRequestFailed = error => ({
  type: PAGE_META + FAILED,
  payload: error,
});

export const openModal = (modal: string) => ({
  type: OPEN_MODAL,
  payload: modal,
});
export const closeModal = () => ({
  type: CLOSE_MODAL,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  user: fromJS(storage.get('user')),
  token: storage.get('token'),
  isLoading: false,
  error: '',
  pendingUser: fromJS(storage.get('pendingUser')),
  isResending: false,
  resendError: '',
  isConfirming: false,
  confirmError: '',
  lpUser: fromJS(storage.get('lpUser')),
  lpToken: storage.get('lpToken'),
  cart: fromJS({
    open: false,
    itemCount: null,
  }),
  uploadedPhoto: '',
  isUploading: false,
  profileBreadcrumbPath: null,
  navbarOpen: false,
  metaJson: {},
  globalSearch: {
    data: null,
    isLoading: false,
    filter: {
      query: {},
    },
    error: '',
  },
  partnerLogos: [],
  pageMeta: null,
  modal: null,
});

let newState = {};

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case REGISTER_EMAIL + REQUESTED:
      return state.set('isLoading', true).set('error', '');

    case REGISTER_EMAIL + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case REGISTER_EMAIL + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case REGISTER_EMAIL + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case REGISTER + REQUESTED:
      return state.set('isLoading', true).set('error', null);

    case REGISTER + SUCCEDED:
      storage.set('user', payload);
      storage.set('token', payload.token);
      return state
        .set('isLoading', false)
        .set('user', fromJS(payload))
        .set('token', payload.token)
        .set('error', '');

    case REGISTER + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case REGISTER + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case RESEND_TOKEN + REQUESTED:
      return state.set('isResending', true).set('resendError', null);

    case RESEND_TOKEN + SUCCEDED:
      return state.set('isResending', false).set('resendError', '');

    case RESEND_TOKEN + FAILED:
      return state.set('isResending', false).set('resendError', payload);

    case RESEND_TOKEN + ERROR:
      return state.set('isResending', false).set(
        'resendError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case SET_USER_TO_CONFIRM_EMAIL:
      if (!storage.get('pendingUser')) {
        storage.set('pendingUser', payload);
        return state.set('pendingUser', payload);
      }
      return state;

    case CONFIRM_EMAIL + REQUESTED:
      return state.set('isConfirming', true).set('confirmError', null);

    case CONFIRM_EMAIL + SUCCEDED:
      storage.remove('pendingUser');
      return state
        .set('pendingUser', null)
        .set('isConfirming', false)
        .set('confirmError', '');

    case CONFIRM_EMAIL + FAILED:
      return state.set('isConfirming', false).set('confirmError', payload);

    case CONFIRM_EMAIL + ERROR:
      return state.set('isConfirming', false).set(
        'confirmError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case USER_DATA_UPDATE + REQUESTED:
      return state.set('isLoading', true).set('error', null);

    case USER_DATA_UPDATE + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case USER_DATA_UPDATE + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case USER_DATA_UPDATE + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case USER_PHOTO_UPLOAD + REQUESTED:
      return state.set('isUploading', true).set('error', null);

    case USER_PHOTO_UPLOAD + SUCCEDED:
      return state
        .set('isUploading', false)
        .set('uploadedPhoto', fromJS(payload).get('link'))
        .set('error', '');

    case USER_PHOTO_UPLOAD + FAILED:
      return state.set('isUploading', false).set('error', payload);

    case USER_PHOTO_UPLOAD + ERROR:
      return state.set('isUploading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case LOGIN + REQUESTED:
      if (meta.type === 'lp') {
        return state.set('isLpLoading', true);
      }
      return state.set('isLoading', true);

    case LOGIN + SUCCEDED:
      if (meta.type === 'lp') {
        storage.set('lpToken', payload.token);
        return state
          .set('isLpLoading', false)
          .set('lpToken', payload.token)
          .set('lpError', '');
      }
      storage.set('token', payload.token);
      return state
        .set('isLoading', false)
        .set('token', payload.token)
        .set('error', '');

    case LOGIN + FAILED:
      if (meta.type === 'lp') {
        return state.set('isLpLoading', false).set('lpError', payload);
      }
      return state.set('isLoading', false).set('error', payload);

    case LOGIN + ERROR:
      if (meta.type === 'lp') {
        return state.set('isLpLoading', false).set(
          'lpError',
          `Something went wrong.
          Please try again later or contact support and provide the following error information: ${payload}`
        );
      }
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case LOGOUT:
      storage.remove('token');
      storage.remove('user');
      return state.set('user', null).set('token', null);

    case USER + REQUESTED:
      return state.set('isLoading', true);

    case USER + SUCCEDED:
      storage.set('user', payload);
      return state
        .set('isLoading', false)
        .set('user', fromJS(payload))
        .set('error', '');

    case USER + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case USER + ERROR:
      return state.set('isLoading', false);

    case OPEN_CART:
      return state.setIn(['cart', 'open'], true);

    case CLOSE_CART:
      return state.setIn(['cart', 'open'], false);

    case UPDATE_CART:
      return state.setIn(['cart', 'itemCount'], payload);

    case SET_PROFILE_BREADCRUMB_PATH:
      return state.set('profileBreadcrumbPath', payload);

    case OPEN_NAVBAR:
      return state.set('navbarOpen', true);

    case CLOSE_NAVBAR:
      return state.set('navbarOpen', false);

    case SET_META_JSON:
      if (meta.path)
        return state.setIn(['metaJson', ...meta.path], fromJS(payload));
      return state.set('metaJson', fromJS(payload));

    case LOCATION_CHANGE:
      return state.set('metaJson', fromJS({})).set('error', '');

    case GLOBAL_SEARCH + REQUESTED:
      newState = state.setIn(['globalSearch', 'isLoading'], true);

      if (meta.path) {
        if (payload && payload.length === 0) {
          return newState.deleteIn(['globalSearch', 'filter', ...meta.path]);
        }
        return newState.setIn(
          ['globalSearch', 'filter', ...meta.path],
          fromJS(payload)
        );
      }
      return newState;

    case GLOBAL_SEARCH + SUCCEDED:
      return state.setIn(['globalSearch', 'isLoading'], false).setIn(
        ['globalSearch', 'data'],
        fromJS(payload.data)
          .groupBy(x => x.get('category'))
          .sort((groupA, groupB) => {
            const a =
              GLOBAL_SEARCH_CATEGORY_ORDER[groupA.get(0).get('category')];
            const b =
              GLOBAL_SEARCH_CATEGORY_ORDER[groupB.get(0).get('category')];
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
          })
      );

    case GLOBAL_SEARCH + FAILED:
      return state.setIn(['globalSearch', 'isLoading'], false);

    case REGISTER_INVESTOR + REQUESTED:
      return state.set('isLoading', true).set('error', null);

    case REGISTER_INVESTOR + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case REGISTER_INVESTOR + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case PAGE_META + SUCCEDED:
      return state.set('pageMeta', fromJS(payload));

    case OPEN_MODAL:
      return state.set('modal', payload);

    case CLOSE_MODAL:
      return state.set('modal', null);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getQuery = state =>
  deepReplace(state.getIn(['app', 'globalSearch', 'filter', 'query']).toJS());
// ------------------------------------
// Sagas
// ------------------------------------
function* UpdateUserDataRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/users/me`,
      data: {
        ...payload,
        knownConditions: deepReplace(payload.knownConditions),
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(userDataUpdateSuccess(response.data));
      yield put(requestUser());
    } else if (response.status === 403 || response.status === 401) {
      yield put(logout());
    } else {
      yield put(userDataUpdateFailed(response.data.message));
    }
  } catch (error) {
    yield put(userDataUpdateError(error));
  }
}

function* UploadUserPhotoRequest({ payload }) {
  const formData = new FormData();
  formData.append('photo', payload);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/photos`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (response.status === 200) {
      yield put(userPhotoUploadSuccess(response.data));
      yield put(requestUserDataUpdate({ picture: response.data.link }));
    } else {
      yield put(userPhotoUploadFailed(response.data.message));
    }
  } catch (error) {
    yield put(userPhotoUploadError(error));
  }
}

function* RegisterEmailRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/register-token`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(registerEmailRequestSuccess(response.data));
    } else {
      yield put(registerEmailRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(registerEmailRequestError(error));
  }
}

function* RegisterRequest({ payload, token }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/signup/${token}`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(registerRequestSuccess(response.data));
      yield put(requestUser());
    } else {
      yield put(registerRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(registerRequestError(error));
  }
}

function* ResendTokenRequest({ payload }) {
  try {
    const data = {
      email: payload,
    };
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/resend-token`,
      data,
    });
    if (response.status === 200) {
      yield put(resendTokenSuccess(response.data));
    } else {
      yield put(resendTokenFailed(response.data.message));
    }
  } catch (error) {
    yield put(resendTokenError(error));
  }
}

function* ConfirmEmailRequest({ payload, meta: { token } }) {
  try {
    const data = {
      email: payload,
      token,
    };
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/email-confirmation`,
      data,
    });
    if (response.status === 200) {
      yield put(confirmEmailSuccess(response.data));
    } else {
      yield put(confirmEmailFailed(response.data.message));
    }
  } catch (error) {
    yield put(confirmEmailError(error));
  }
}

function* LoginRequest({ payload, meta }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(loginRequestSuccess(response.data, meta.type));
      yield put(requestUser(meta.type));
    } else if (response.status === 429) {
      yield put(
        loginRequestFailed(
          "You've tried to login too many times. Please try again in 30 minutes.",
          meta.type
        )
      );
    } else {
      yield put(loginRequestFailed(response.data.message, meta.type));
    }
  } catch (error) {
    yield put(loginRequestError(error, meta.type));
  }
}

function* UserRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      url: `${API_URL}/account/me`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(userRequestSuccess(response.data));
    } else {
      yield put(userRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(userRequestError(error));
  }
}

function* GlobalSearchRequest() {
  const query = yield select(getQuery.bind(null));
  if (query.q) {
    query.$text = { $search: query.q };
  }
  delete query.q;
  try {
    const response = yield call(request, {
      url: `${API_URL}/search?query=${encodeURI({ ...query })}`,
    });
    yield put(globalSearchSuccess(query.$text, response));
  } catch (error) {
    yield put(globalSearchFailed(error));
  }
}

function* RegisterInvestorRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/users/register-investor`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(registerInvestorRequestSuccess(response.data));
    } else {
      yield put(registerInvestorRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(registerInvestorRequestFailed(error));
  }
}

function* PageMetaRequest({ payload }) {
  try {
    if (CONFIG.IS_CONTENTFUL) {
      const response = yield call(client.getEntries, {
        content_type: CONTENT_TYPES.PAGE,
        'fields.pathname': payload,
      });
      yield put(pageMetaRequestSuccess(fromJS(response.items)));
    }
  } catch (error) {
    yield put(pageMetaRequestFailed());
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(USER_DATA_UPDATE + REQUESTED, UpdateUserDataRequest),
    takeLatest(USER_PHOTO_UPLOAD + REQUESTED, UploadUserPhotoRequest),
    takeLatest(REGISTER_EMAIL + REQUESTED, RegisterEmailRequest),
    takeLatest(REGISTER + REQUESTED, RegisterRequest),
    takeLatest(RESEND_TOKEN + REQUESTED, ResendTokenRequest),
    takeLatest(USER + REQUESTED, UserRequest),
    takeLatest(GLOBAL_SEARCH + REQUESTED, GlobalSearchRequest),
    takeLatest(CONFIRM_EMAIL + REQUESTED, ConfirmEmailRequest),
    takeLatest(LOGIN + REQUESTED, LoginRequest),
    takeLatest(REGISTER_INVESTOR + REQUESTED, RegisterInvestorRequest),
    takeLatest(PAGE_META + REQUESTED, PageMetaRequest),
  ]);
}
