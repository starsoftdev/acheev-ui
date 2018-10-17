// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import storage from 'store';
import { fromJS, List } from 'immutable';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
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
} from 'enum/constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken, getUserId } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const REGISTER_EMAIL = 'Acheev/App/REGISTER_EMAIL';
const REGISTER = 'Acheev/App/REGISTER';
const LOGIN = 'Acheev/App/LOGIN';
const LOGOUT = 'Acheev/App/LOGOUT';
const FORGOT_PASSWORD = 'Acheev/App/FORGOT_PASSWORD';
const USER = 'Acheev/App/USER';
const USER_DATA_UPDATE = 'Acheev/App/UPDATE_USER_DATA';
const SEND_INVITE = 'Acheev/App/SEND_INVITE';
const PAGE_META = 'Acheev/App/PAGE_META';

const USER_PHOTO_UPLOAD = 'Acheev/App/UPLOAD_USER_PHOTO';
const SET_PROFILE_BREADCRUMB_PATH = 'Acheev/App/SET_PROFILE_BREADCRUMB_PATH';

const OPEN_NAVBAR = 'Acheev/App/OPEN_NAVBAR';
const CLOSE_NAVBAR = 'Acheev/App/CLOSE_NAVBAR';

const SET_META_JSON = 'Acheev/App/SET_META_JSON';

const GLOBAL_SEARCH = 'Acheev/App/GLOBAL_SEARCH';

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

export const requestForgotPassword = (payload: Object) => ({
  type: FORGOT_PASSWORD + REQUESTED,
  payload,
});
const forgotPasswordRequestSuccess = (payload: Object) => ({
  type: FORGOT_PASSWORD + SUCCEDED,
  payload,
});
const forgotPasswordRequestFailed = error => ({
  type: FORGOT_PASSWORD + FAILED,
  payload: error,
});
const forgotPasswordRequestError = error => ({
  type: FORGOT_PASSWORD + ERROR,
  payload: error,
});

export const requestUserDataUpdate = (payload: Object) => ({
  type: USER_DATA_UPDATE + REQUESTED,
  payload,
});

const userDataUpdateSuccess = (payload: Object) => ({
  type: USER_DATA_UPDATE + SUCCEDED,
  payload,
});

const userDataUpdateFailed = error => ({
  type: USER_DATA_UPDATE + FAILED,
  payload: error,
});
const userDataUpdateError = error => ({
  type: USER_DATA_UPDATE + ERROR,
  payload: error,
});

export const requestUserPhotoUpload = (payload: string) => ({
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

export const requestLogin = (payload: Object) => ({
  type: LOGIN + REQUESTED,
  payload,
});
export const loginRequestSuccess = (payload: Object) => ({
  type: LOGIN + SUCCEDED,
  payload,
});
const loginRequestFailed = (error: string) => ({
  type: LOGIN + FAILED,
  payload: error,
});
const loginRequestError = (error: string) => ({
  type: LOGIN + ERROR,
  payload: error,
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

export const setProfileBreadcrumbPath = (path: List<Map<string, Object>>) => ({
  type: SET_PROFILE_BREADCRUMB_PATH,
  payload: path,
});

export const requestSendInvite = (payload: Object) => ({
  type: SEND_INVITE + REQUESTED,
  payload,
});
const sendInviteRequestSuccess = (payload: Object) => ({
  type: SEND_INVITE + SUCCEDED,
  payload,
});
const sendInviteRequestFailed = (error: string) => ({
  type: SEND_INVITE + FAILED,
  payload: error,
});
const sendInviteRequestError = (error: string) => ({
  type: SEND_INVITE + ERROR,
  payload: error,
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

export const requestGlobalSearch = (path: string, value: Object) => ({
  type: GLOBAL_SEARCH + REQUESTED,
  payload: value,
  meta: {
    path,
  },
});
const globalSearchSuccess = (keyword: Object, data: Object) => ({
  type: GLOBAL_SEARCH + SUCCEDED,
  payload: data,
});
const globalSearchFailed = (error: string) => ({
  type: GLOBAL_SEARCH + FAILED,
  payload: error,
});

export const requestPageMeta = (pathname: string) => ({
  type: PAGE_META + REQUESTED,
  payload: pathname,
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

    case FORGOT_PASSWORD + REQUESTED:
      return state.set('isLoading', true).set('error', '');

    case FORGOT_PASSWORD + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case FORGOT_PASSWORD + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case FORGOT_PASSWORD + ERROR:
      return state.set('isLoading', false).set(
        'error',
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
      return state.set('isUploading', false).set('error', '');

    case USER_PHOTO_UPLOAD + FAILED:
      return state.set('isUploading', false).set('error', payload);

    case USER_PHOTO_UPLOAD + ERROR:
      return state.set('isUploading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case LOGIN + REQUESTED:
      return state.set('isLoading', true);

    case LOGIN + SUCCEDED:
      storage.set('token', payload.token);
      return state
        .set('isLoading', false)
        .set('token', payload.token)
        .set('error', '');

    case LOGIN + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case LOGIN + ERROR:
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

    case SEND_INVITE + REQUESTED:
      return state.set('isLoading', true);

    case SEND_INVITE + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case SEND_INVITE + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case SEND_INVITE + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

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
  const userId = yield select(getUserId);
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/user/${userId}`,
      data: payload,
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
  const token = yield select(getToken);
  const userId = yield select(getUserId);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/${userId}/avatar`,
      data: {
        image: payload,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(userPhotoUploadSuccess(response.data));
      yield put(requestUser());
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

function* ForgotPasswordRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/forgot`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(forgotPasswordRequestSuccess(response.data));
    } else {
      yield put(forgotPasswordRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(forgotPasswordRequestError(error));
  }
}

function* LoginRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/signin`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(loginRequestSuccess(response.data));
      yield put(requestUser());
    } else if (response.status === 429) {
      yield put(
        loginRequestFailed(
          "You've tried to login too many times. Please try again in 30 minutes."
        )
      );
    } else {
      yield put(loginRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(loginRequestError(error));
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

function* SendInviteRequest({ payload }) {
  const token = yield select(getToken);
  const userId = yield select(getUserId);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/invite/user/${userId}/invites`,
      data: {
        invitees: payload,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(sendInviteRequestSuccess(response.data));
    } else {
      yield put(sendInviteRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(sendInviteRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(USER_DATA_UPDATE + REQUESTED, UpdateUserDataRequest),
    takeLatest(USER_PHOTO_UPLOAD + REQUESTED, UploadUserPhotoRequest),
    takeLatest(REGISTER_EMAIL + REQUESTED, RegisterEmailRequest),
    takeLatest(REGISTER + REQUESTED, RegisterRequest),
    takeLatest(FORGOT_PASSWORD + REQUESTED, ForgotPasswordRequest),
    takeLatest(USER + REQUESTED, UserRequest),
    takeLatest(GLOBAL_SEARCH + REQUESTED, GlobalSearchRequest),
    takeLatest(LOGIN + REQUESTED, LoginRequest),
    takeLatest(SEND_INVITE + REQUESTED, SendInviteRequest),
  ]);
}
