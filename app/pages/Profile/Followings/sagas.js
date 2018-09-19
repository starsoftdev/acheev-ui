// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import deepReplace from 'utils/deepReplaceToString';
import { stringify } from 'qs';
import { API_URL, REQUESTED, SUCCEDED, FAILED } from 'enum/constants';
import type { Action, State } from 'types/common';

// ------------------------------------
// Constants
// ------------------------------------
const FOLLOWINGS = 'Lift/ME/FOLLOWINGS';
// ------------------------------------
// Actions
// ------------------------------------
export const requestFollowings = (
  userId: string,
  path: string,
  value: Object
) => ({
  type: FOLLOWINGS + REQUESTED,
  payload: userId,
  meta: {
    path,
    value,
  },
});
const followingsRequestSuccess = (data: Object) => ({
  type: FOLLOWINGS + SUCCEDED,
  payload: data,
});
const followingsRequestFailed = () => ({
  type: FOLLOWINGS + FAILED,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  filter: {
    model: {
      page: 1,
      per_page: 8,
    },
  },
  isLoading: false,
  data: null,
});

let newState = {};

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case FOLLOWINGS + REQUESTED:
      newState = state.setIn(['isLoading'], true);

      if (meta.path) {
        return newState.setIn(['filter', ...meta.path], fromJS(meta.value));
      }
      return newState;

    case FOLLOWINGS + SUCCEDED:
      return state
        .setIn(['isLoading'], false)
        .setIn(['data'], fromJS(payload.data));

    case FOLLOWINGS + FAILED:
      return state.setIn(['isLoading'], false);
    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getModel = (category, state) =>
  deepReplace(state.getIn(['myfollowings', 'filter', 'model']).toJS());
// ------------------------------------
// Sagas
// ------------------------------------
function* FollowingsRequest({ payload: user }) {
  const model = yield select(getModel.bind(null, 'followings'));
  try {
    const reviews = yield call(request, {
      url: `${API_URL}/follows?query=${encodeURI({
        user,
        itemType: 'Product',
      })}&${stringify(model)}`,
    });
    yield put(followingsRequestSuccess(reviews));
  } catch (error) {
    yield put(followingsRequestFailed());
  }
}

export default function*(): Saga<void> {
  yield [takeLatest(FOLLOWINGS + REQUESTED, FollowingsRequest)];
}
