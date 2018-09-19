// @flow

import type { Map } from 'immutable';

export type Action = {
  type: string,
  payload: any,
  meta: any,
};

export type State = Map<string, Function>;

export type Store = {
  dispatch: Function,
  subscribe: Function,
  getState: Function,
  replaceReducer: Function,
  runSaga: Function,
  asyncReducers: Object,
  asyncSagas: Object,
};
