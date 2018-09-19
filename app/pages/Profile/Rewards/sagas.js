// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import storage from 'store';
import { fromJS } from 'immutable';
import { sortBy } from 'lodash-es';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import { requestUser } from 'containers/App/sagas';
import type { Saga } from 'redux-saga';
import request from 'utils/request';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import AnalyticsEvents from 'enum/analytics/events';
import type { Action, State } from 'types/common';
import CONFIG from 'conf';

// ------------------------------------
// Constants
// ------------------------------------
const GET_REWARDS = 'Lift/RewardsDashboard/GET_REWARDS';
const GET_REDEMPTIONS = 'Lift/RewardsDashboard/GET_REDEMPTIONS';
const UNLOCK_REWARD = 'Lift/RewardsDashboard/UNLOCK_REWARD';
const REDEEM_PROMO_CODE = 'Lift/RewardsDashboard/REDEEM_PROMO_CODE';

// ------------------------------------
// Actions
// ------------------------------------
export const requestRewards = () => ({
  type: GET_REWARDS + REQUESTED,
});

const rewardsRequestSuccess = (data: Object) => ({
  type: GET_REWARDS + SUCCEDED,
  payload: data,
});
const rewardsRequestFailed = error => ({
  type: GET_REWARDS + FAILED,
  payload: error,
});

export const redeemPromoCode = (payload: Object) => ({
  type: REDEEM_PROMO_CODE + REQUESTED,
  payload,
});

const redeemPromoCodeSuccess = (data: Object) => ({
  type: REDEEM_PROMO_CODE + SUCCEDED,
  payload: data,
});
const redeemPromoCodeError = error => ({
  type: REDEEM_PROMO_CODE + ERROR,
  payload: error,
});
const redeemPromoCodeFailed = error => ({
  type: REDEEM_PROMO_CODE + FAILED,
  payload: error,
});

export const requestRedemptions = () => ({
  type: GET_REDEMPTIONS + REQUESTED,
});

const redemptionsRequestSuccess = (data: Object) => ({
  type: GET_REDEMPTIONS + SUCCEDED,
  payload: data,
});
const redemptionsRequestFailed = error => ({
  type: GET_REDEMPTIONS + FAILED,
  payload: error,
});

export const unlockReward = (payload: Object) => ({
  type: UNLOCK_REWARD + REQUESTED,
  payload,
});
const unlockRewardRequestSuccess = (payload: Object, reward: Object) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.REDEMPTION_CREATED, {
      title: reward.title,
      details: reward.details,
      business: reward.business.name,
    });
  }
  return {
    type: UNLOCK_REWARD + SUCCEDED,
    payload,
  };
};
const unlockRewardRequestError = error => ({
  type: UNLOCK_REWARD + FAILED,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  user: fromJS(storage.get('user')),
  token: storage.get('token'),
  isLoading: false,
  error: '',
  success: '',
  isPromoChecking: false,
  promoError: '',
  promoSuccess: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case GET_REWARDS + REQUESTED:
      return state.set('isLoading', true);

    case GET_REWARDS + SUCCEDED:
      return state.set('isLoading', false).set('rewards', fromJS(payload));

    case GET_REWARDS + FAILED:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case GET_REDEMPTIONS + SUCCEDED:
      return state.set('isLoading', false).set('redemptions', fromJS(payload));

    case GET_REDEMPTIONS + FAILED:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case UNLOCK_REWARD + REQUESTED:
      return state
        .set('isLoading', true)
        .set('error', '')
        .set('success', '');

    case UNLOCK_REWARD + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('success', 'Reward successfully unlocked')
        .setIn(['rewards', 'data'], payload);

    case UNLOCK_REWARD + FAILED:
      return state
        .set('isLoading', false)
        .set('error', payload)
        .set('success', '');

    case REDEEM_PROMO_CODE + REQUESTED:
      return state
        .set('isPromoChecking', true)
        .set('promoError', '')
        .set('promoSuccess', '');

    case REDEEM_PROMO_CODE + SUCCEDED:
      return state
        .set('isPromoChecking', false)
        .set('promoError', '')
        .set(
          'promoSuccess',
          `Congratulations! You've just earned ${payload.points} Lift Points`
        );

    case REDEEM_PROMO_CODE + ERROR:
      return state
        .set('isPromoChecking', false)
        .set('promoSuccess', '')
        .set('promoError', payload);

    case REDEEM_PROMO_CODE + FAILED:
      return state
        .set('isPromoChecking', false)
        .set('promoSuccess', '')
        .set(
          'promoError',
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
const getUser = state => state.getIn(['app', 'user']);
const getToken = state => state.getIn(['app', 'token']);
const getRewards = state => state.getIn(['myRewards', 'rewards', 'data']);

// ------------------------------------
// Sagas
// ------------------------------------
function* RewardsRequest() {
  const url = `${API_URL}/rewards`;
  let token = yield select(getToken);
  if (!token) {
    const user = yield select(getUser);
    token = user.get('token');
  }
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = yield call(request, {
      url,
      headers,
    });
    if (response.status === 200) {
      response.data = sortBy(response.data, ['-createdOn', '-multiUse']);
      yield put(rewardsRequestSuccess(response));
    } else {
      yield put(rewardsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(rewardsRequestFailed(error));
  }
}

function* RedemptionsRequest() {
  const url = `${API_URL}/rewards/redemptions`;
  const token = yield select(getToken);
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = yield call(request, {
      url,
      headers,
    });
    if (response.status === 200) {
      response.data = sortBy(response.data, ['redeemed']);
      yield put(redemptionsRequestSuccess(response));
    } else {
      yield put(redemptionsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(redemptionsRequestFailed(error));
  }
}

function* UnlockRewardRequest({ payload }) {
  const url = `${API_URL}/rewards/${payload.get('id')}/redeem`;
  const token = yield select(getToken);
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = yield call(request, {
      method: 'POST',
      url,
      headers,
      data: payload,
    });
    if (response.status === 200) {
      const rewards = yield select(getRewards);
      const rewardId = response.data.reward.id;
      const newRewards = rewards.filter(r => {
        if (r.get('multiUse')) return true;
        return r.get('id') !== rewardId;
      });
      yield put(unlockRewardRequestSuccess(newRewards, response.data.reward));
      yield put(requestRedemptions());
      yield put(requestUser()); // request user to fetch updated lift points
    } else {
      yield put(unlockRewardRequestError(response.data.message));
    }
  } catch (error) {
    yield put(unlockRewardRequestError(error));
  }
}

function* RedeemPromoCodeRequest({ payload }) {
  const url = `${API_URL}/promo-codes/redeem`;
  const token = yield select(getToken);
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = yield call(request, {
      method: 'POST',
      url,
      headers,
      data: payload,
    });
    if (response.status === 200) {
      yield put(redeemPromoCodeSuccess(response.data));
      yield put(requestRedemptions());
    } else if (response.status === 404) {
      yield put(redeemPromoCodeError('Promo code is incorrect.'));
    } else if (response.status === 422) {
      yield put(redeemPromoCodeError(response.data.message));
    } else {
      yield put(redeemPromoCodeFailed(response.data.message));
    }
  } catch (error) {
    yield put(redeemPromoCodeFailed(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(GET_REWARDS + REQUESTED, RewardsRequest),
    takeLatest(GET_REDEMPTIONS + REQUESTED, RedemptionsRequest),
    takeLatest(UNLOCK_REWARD + REQUESTED, UnlockRewardRequest),
    takeLatest(REDEEM_PROMO_CODE + REQUESTED, RedeemPromoCodeRequest),
  ]);
}
