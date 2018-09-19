// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import storage from 'store';
import { fromJS } from 'immutable';
import { history } from 'components/ConnectedRouter';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import { toastr } from 'react-redux-toastr';
import { cloneDeep, get, set } from 'lodash-es';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import {
  API_URL,
  REQUESTED,
  SUCCEDED,
  FAILED,
  ERROR,
  CLEAR,
} from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import qs from 'qs';

// ------------------------------------
// Fixed data to fill for some user types
// ------------------------------------

const DASHBOARD_STATS = {
  productReviewCount: 0,
  productRating: 5,
  businessReviewCount: 0,
  businessRating: 2,
  reviewsRatio: [
    { date: '2018-03-31', businessRatio: 0.1, productRatio: 0.1 },
    { date: '2018-04-01', businessRatio: 0.15, productRatio: 0.2 },
    { date: '2018-04-02', businessRatio: 0.17, productRatio: 0.05 },
    { date: '2018-04-03', businessRatio: 0.2, productRatio: 0.08 },
    { date: '2018-04-04', businessRatio: 0.18, productRatio: 0.1 },
  ],
};

const DASHBOARD_REDEMPTIONS = {
  redeemedCount: 80,
  redeemedValue: 200000,
  redemptions: [
    { title: '$50 discount off medical cannabis', price: 1000, count: 40 },
    { title: 'Testing Rewards', price: 2500, count: 20 },
    { title: 'RewardsApril', price: 5000, count: 20 },
  ],
};

const META_DATA = {
  patients: {
    business: { avgAge: '50', male: 6, female: 6 },
    lift: { avgAge: '50', male: 6, female: 6 },
    shared: {
      ratio: 0.5,
      topCompetitors: [
        {
          business: 'aphiria-1',
          count: 4,
          sharedRatio: 1,
          slug: 'aphiria',
          photos: [],
          name: 'Aphiria',
        },
        {
          business: 'emblem-1',
          count: 3,
          sharedRatio: 0.75,
          slug: 'emblem',
          photos: [],
          name: 'Emblem',
        },
        {
          business: 'canada-island-garden-1',
          count: 3,
          sharedRatio: 0.5,
          slug: 'canada-island-garden',
          photos: [],
          name: "Canada's Island Garden",
        },
      ],
    },
  },
  geo: [
    { province: 'Ontario', count: 1 },
    { province: 'Quebec', count: 1 },
    { province: 'Nova Scotia', count: 1 },
    { province: 'New Brunswick', count: 1 },
    { province: 'Manitoba', count: 1 },
    { province: 'British Columbia', count: 1 },
    { province: 'Prince Edward Island', count: 1 },
    { province: 'Saskatchewan', count: 1 },
    { province: 'Alberta', count: 1 },
    { province: 'Newfoundland and Labrador', count: 1 },
    { province: 'Northwest Territories', count: 1 },
    { province: 'Yukon', count: 1 },
    { province: 'Nunavut', count: 1 },
  ],
  report: {
    symptomsHelped: [
      {
        name: 'Anxiety',
        score: 10,
        product: {
          _id: 'pink-punk',
          slug: 'pink-kush',
          name: 'Pink Kush',
          __t: 'Strain',
        },
      },
      {
        name: 'Depression',
        score: 7,
        product: {
          _id: 'blue-kush',
          slug: 'blue-kush',
          name: 'Blue Kush',
          __t: 'Oil',
        },
      },
      {
        name: 'PTSD',
        score: 5,
        product: {
          _id: 'yellow-kush',
          slug: 'yellow-kush',
          name: 'Yellow Kush',
          __t: 'Strain',
        },
      },
      {
        name: 'Headaches',
        score: 3,
        product: {
          _id: 'orange-kush',
          slug: 'orange-kush',
          name: 'Orange Kush',
          __t: 'Strain',
        },
      },
      {
        name: 'Pain',
        score: 1,
        product: {
          _id: 'rainbow-kush',
          slug: 'rainbow-kush',
          name: 'Rainbow Kush',
          __t: 'Oil',
        },
      },
    ],
    positiveEffects: [
      {
        name: 'Alert',
        score: 10,
        product: {
          _id: 'pink-kush',
          slug: 'pink-kush',
          name: 'Pink Kush',
          __t: 'Oil',
        },
      },
      {
        name: 'Calm',
        score: 7,
        product: {
          _id: 'blue-kush',
          slug: 'blue-kush',
          name: 'Blue Kush',
          __t: 'Strain',
        },
      },
      {
        name: 'Awake',
        score: 5,
        product: {
          _id: 'yellow-kush',
          slug: 'yellow-kush',
          name: 'Yellow Kush',
          __t: 'Strain',
        },
      },
      {
        name: 'Appetite Enhancing',
        score: 3,
        product: {
          _id: 'orange-kush',
          slug: 'orange-kush',
          name: 'Orange Kush',
          __t: 'Oil',
        },
      },
      {
        name: 'Calming',
        score: 1,
        product: {
          _id: 'rainbow-kush',
          slug: 'rainbow-kush',
          name: 'Rainbow Kush',
          __t: 'Strain',
        },
      },
    ],
    negativeEffects: [
      {
        name: 'Dry Mouth',
        score: 10,
        product: {
          _id: 'pink-kush',
          slug: 'pink-kush',
          name: 'Pink Kush',
          __t: 'Oil',
        },
      },
      {
        name: 'Dizzy',
        score: 7,
        product: {
          _id: 'blue-kush',
          slug: 'blue-kush',
          name: 'Blue Kush',
          __t: 'Strain',
        },
      },
      {
        name: 'Harsh',
        score: 5,
        product: {
          _id: 'yellow-kush',
          slug: 'yellow-kush',
          name: 'Yellow Kush',
          __t: 'Strain',
        },
      },
      {
        name: 'Chest Congestion',
        score: 3,
        product: {
          _id: 'orange-kush',
          slug: 'orange-kush',
          name: 'Orange Kush',
          __t: 'Oil',
        },
      },
      {
        name: 'Hungry',
        score: 1,
        product: {
          _id: 'rainbow-kush',
          slug: 'rainbow-kush',
          name: 'Rainbow Kush',
          __t: 'Strain',
        },
      },
    ],
  },
};

const PRODUCT_REVIEWS_DATA = {
  hits: [
    {
      _id: '5493kdfsoier',
      business: '5493kdfsoierfds',
      id: '5493kdfsoier',
      durationOfEffect: 1.5,
      timeOfConsumption: 'daytime',
      methodOfConsumption: 'joint',
      cbd: 16,
      thc: 0.7,
      purchasedPrice: 11,
      purchasedOn: '2018-02-26T18:30:00.000Z',
      wouldPurchaseAgain: true,
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullanco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      title: 'Review Title',
      rating: 4,
      product: {
        thc: '12 - 23%',
        cbd: '2 - 21%',
        id: '5a968e0fbfa17f0dd9a8e95c',
        name: 'Generic Strain',
        __v: 1,
        __t: 'Strain',
        variants: [
          {
            doseUnit: 'each',
            doseAmount: 10,
            price: 1000,
            _id: '5a968e0fbfa17f0dd9a8e95d',
            weightUnit: 'g',
            availabilityStatus: 'available',
            available: true,
          },
        ],
      },
      user: {
        _id: 25877,
        slug: 'consumer1234',
        username: 'Consumer1234',
      },
      __v: 2,
      approvedOn: '2018-02-28T12:52:03.466Z',
      __t: 'CannabisProductReview',
      updatedOn: '2018-03-22T12:49:32.650Z',
      createdOn: '2018-02-28T12:51:25.579Z',
      isDoubledPoint: true,
      points: 480,
      quality: 'poor',
      downVotes: Array(73).fill(1),
      upVotes: Array(73).fill(1),
      photos: [],
      published: true,
      negativeEffects: [{ name: 'Nausea', _id: 'nause-1', value: 4 }],
      positiveEffects: [{ name: 'Headache', _id: 'headache-1', value: 4 }],
      flavours: ['berry', 'butter'],
      symptomsHelped: [],
      prescribedFor: ['ADD/ADHD', 'Gastrointestinal disorder'],
    },
    {
      _id: '5493kdfsoier',
      business: '5493kdfsoierfds',
      id: '5493kdfsoier',
      durationOfEffect: 1.5,
      timeOfConsumption: 'daytime',
      methodOfConsumption: 'joint',
      cbd: 16,
      thc: 0.7,
      purchasedPrice: 11,
      purchasedOn: '2018-02-26T18:30:00.000Z',
      wouldPurchaseAgain: true,
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullanco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      title: 'Review Title',
      rating: 4,
      product: {
        thc: '12 - 23%',
        cbd: '2 - 21%',
        id: '5a968e0fbfa17f0dd9a8e95c',
        name: 'Generic Strain',
        __v: 1,
        __t: 'Strain',
        variants: [
          {
            doseUnit: 'each',
            doseAmount: 10,
            price: 1000,
            _id: '5a968e0fbfa17f0dd9a8e95d',
            weightUnit: 'g',
            availabilityStatus: 'available',
            available: true,
          },
        ],
      },
      user: {
        _id: 25877,
        slug: 'consumer1234',
        username: 'Consumer1234',
      },
      __v: 2,
      approvedOn: '2018-02-28T12:52:03.466Z',
      __t: 'CannabisProductReview',
      updatedOn: '2018-03-22T12:49:32.650Z',
      createdOn: '2018-02-28T12:51:25.579Z',
      isDoubledPoint: true,
      points: 480,
      quality: 'poor',
      downVotes: Array(73).fill(1),
      upVotes: Array(73).fill(1),
      photos: [],
      published: true,
      negativeEffects: [{ name: 'Nausea', _id: 'nause-1', value: 4 }],
      positiveEffects: [{ name: 'Headache', _id: 'headache-1', value: 4 }],
      flavours: ['berry', 'butter'],
      symptomsHelped: [],
      prescribedFor: ['ADD/ADHD', 'Gastrointestinal disorder'],
    },
  ],
  page: 1,
  per_page: 10,
  count: 2,
  pages: 1,
};

// ------------------------------------
// Constants
// ------------------------------------
const BUSINESSES = 'Lift/LP/BUSINESSES';
const PRODUCTS = 'Lift/LP/PRODUCTS';
const PRODUCT = 'Lift/LP/PRODUCT';
const BUSINESS_REVIEWS = 'Lift/LP/BUSINESS_REVIEWS';
const PRODUCT_REVIEWS = 'Lift/LP/PRODUCT_REVIEWS';
const LOGO_UPLOAD = 'Lift/LP/LOGO_UPLOAD';
const UPDATE_PRODUCER_PROFILE = 'Lift/LP/UPDATE_PRODUCER_PROFILE';
const SUBMIT_PRODUCT = 'Lift/LP/SUBMIT_PRODUCT';
const STATS = 'Lift/LP/STATS';
const REDEMPTIONS = 'Lift/LP/REDEMPTIONS';
const DEMOGRAPHICS = 'Lift/LP/DEMOGRAPHICS';

// ------------------------------------
// Actions
// ------------------------------------

export const requestBusinesses = (id: string, query?: Object) => ({
  type: BUSINESSES + REQUESTED,
  payload: id,
  meta: query,
});
const businessesRequestSuccess = (payload: Object) => ({
  type: BUSINESSES + SUCCEDED,
  payload,
});
const businessesRequestFailed = error => ({
  type: BUSINESSES + FAILED,
  payload: error,
});
const businessesRequestError = error => ({
  type: BUSINESSES + ERROR,
  payload: error,
});

export const requestStats = (
  businessId: string,
  from?: string,
  to?: string,
  interval?: string
) => ({
  type: STATS + REQUESTED,
  payload: businessId,
  meta: {
    from,
    to,
    interval,
  },
});
const statsRequestSuccess = (payload: Object) => ({
  type: STATS + SUCCEDED,
  payload,
});
const statsRequestFailed = error => ({
  type: STATS + FAILED,
  payload: error,
});
const statsRequestError = error => ({
  type: STATS + ERROR,
  payload: error,
});

export const requestRedemptions = (
  businessId: string,
  from?: string,
  to?: string
) => ({
  type: REDEMPTIONS + REQUESTED,
  payload: businessId,
  meta: {
    from,
    to,
  },
});
const redemptionsRequestSuccess = (payload: Object) => ({
  type: REDEMPTIONS + SUCCEDED,
  payload,
});
const redemptionsRequestFailed = error => ({
  type: REDEMPTIONS + FAILED,
  payload: error,
});
const redemptionsRequestError = error => ({
  type: REDEMPTIONS + ERROR,
  payload: error,
});

export const requestProducts = (query: {}, queryString?: {}) => ({
  type: PRODUCTS + REQUESTED,
  payload: { query, queryString },
});

export const clearProducts = () => ({
  type: PRODUCTS + CLEAR,
});

const productsRequestSuccess = (payload: Object) => ({
  type: PRODUCTS + SUCCEDED,
  payload,
});

const productsRequestFailed = error => ({
  type: PRODUCTS + FAILED,
  payload: error,
});

const productsRequestError = error => ({
  type: PRODUCTS + ERROR,
  payload: error,
});

export const requestProduct = (id: string) => ({
  type: PRODUCT + REQUESTED,
  payload: id,
});
const productRequestSuccess = (payload: Object) => ({
  type: PRODUCT + SUCCEDED,
  payload,
});
const productRequestFailed = error => ({
  type: PRODUCT + FAILED,
  payload: error,
});
const productRequestError = error => ({
  type: PRODUCT + ERROR,
  payload: error,
});

export const requestBusinessReviews = (query: {}, queryString: {}) => ({
  type: BUSINESS_REVIEWS + REQUESTED,
  payload: { query, queryString },
});
const businessReviewsRequestSuccess = (payload: Object) => ({
  type: BUSINESS_REVIEWS + SUCCEDED,
  payload,
});
const businessReviewsRequestFailed = error => ({
  type: BUSINESS_REVIEWS + FAILED,
  payload: error,
});
const businessReviewsRequestError = error => ({
  type: BUSINESS_REVIEWS + ERROR,
  payload: error,
});

export const requestProductReviews = (query: {}, queryString: {}) => ({
  type: PRODUCT_REVIEWS + REQUESTED,
  payload: { query, queryString },
});

export const clearProductReviews = () => ({
  type: PRODUCT_REVIEWS + CLEAR,
});

const productReviewsRequestSuccess = (payload: Object) => ({
  type: PRODUCT_REVIEWS + SUCCEDED,
  payload,
});
const productReviewsRequestFailed = error => ({
  type: PRODUCT_REVIEWS + FAILED,
  payload: error,
});
const productReviewsRequestError = error => ({
  type: PRODUCT_REVIEWS + ERROR,
  payload: error,
});

export const uploadLogo = (payload: Object) => ({
  type: LOGO_UPLOAD + REQUESTED,
  payload,
});
const logoUploadSuccess = (payload: Object) => ({
  type: LOGO_UPLOAD + SUCCEDED,
  payload,
});
const logoUploadFailed = error => ({
  type: LOGO_UPLOAD + FAILED,
  payload: error,
});
const logoUploadError = error => ({
  type: LOGO_UPLOAD + ERROR,
  payload: error,
});

export const updateProducerProfile = (id: string, data: Object) => ({
  type: UPDATE_PRODUCER_PROFILE + REQUESTED,
  payload: id,
  meta: data,
});
const updateProducerProfileSuccess = (payload: Object) => ({
  type: UPDATE_PRODUCER_PROFILE + SUCCEDED,
  payload,
});
const updateProducerProfileFailed = error => ({
  type: UPDATE_PRODUCER_PROFILE + FAILED,
  payload: error,
});
const updateProducerProfileError = error => ({
  type: UPDATE_PRODUCER_PROFILE + ERROR,
  payload: error,
});

export const submitProduct = (id: string, payload: Object) => ({
  type: SUBMIT_PRODUCT + REQUESTED,
  payload,
  meta: {
    id,
  },
});
const submitProductSuccess = (payload: Object) => ({
  type: SUBMIT_PRODUCT + SUCCEDED,
  payload,
});
const submitProductFailed = error => ({
  type: SUBMIT_PRODUCT + FAILED,
  payload: error,
});
const submitProductError = error => ({
  type: SUBMIT_PRODUCT + ERROR,
  payload: error,
});

export const requestDemographics = (
  businessId: string,
  from?: string,
  to?: string
) => ({
  type: DEMOGRAPHICS + REQUESTED,
  payload: businessId,
  meta: {
    from,
    to,
  },
});
const demographicsRequestSuccess = (payload: Object) => ({
  type: DEMOGRAPHICS + SUCCEDED,
  payload,
});
const demographicsRequestFailed = () => ({
  type: DEMOGRAPHICS + FAILED,
});
const demographicsRequestError = () => ({
  type: DEMOGRAPHICS + ERROR,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  data: null,
  isLoading: false,
  error: '',
  business: null,
  slug: null,
  businesses: {
    data: [],
    isLoading: false,
    error: '',
  },
  products: {
    data: null,
    isLoading: false,
    error: '',
  },
  businessReviews: {
    data: [],
    isLoading: false,
    error: '',
  },
  productReviews: {
    data: [],
    isLoading: false,
    error: '',
  },
  breadcrumbPath: null,
  helmetTitle: 'Lift & Co.',
  id: null,
  logo: {
    isUploading: false,
    path: null,
    error: null,
  },
  producerProfile: {
    data: null,
    isLoading: false,
    error: null,
  },
  product: {
    data: null,
    isLoading: false,
    isUpdating: false,
    error: null,
  },
  stats: {
    data: null,
    isLoading: false,
  },
  redemptions: {
    data: null,
    isLoading: true,
  },
  demographics: {
    data: null,
    isLoading: true,
  },
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case BUSINESSES + REQUESTED:
      return state
        .setIn(['businesses', 'isLoading'], true)
        .setIn(['businesses', 'data'], null)
        .setIn(['businesses', 'error'], '');

    case BUSINESSES + SUCCEDED:
      return state
        .setIn(['businesses', 'isLoading'], false)
        .setIn(['businesses', 'data'], fromJS(payload))
        .setIn(['businesses', 'error'], '');

    case BUSINESSES + FAILED:
      return state
        .setIn(['businesses', 'isLoading'], false)
        .setIn(['businesses', 'error'], payload);

    case BUSINESSES + ERROR:
      return state
        .setIn(['businesses', 'isLoading'], false)
        .setIn(['businesses', 'error'], payload);

    case STATS + REQUESTED:
      return state.setIn(['stats', 'isLoading'], true);

    case STATS + SUCCEDED:
      return state
        .setIn(['stats', 'isLoading'], false)
        .setIn(['stats', 'data'], fromJS(payload));

    case STATS + FAILED:
      return state.setIn(['stats', 'isLoading'], false);

    case STATS + ERROR:
      return state.setIn(['businesses', 'isLoading'], false);

    case REDEMPTIONS + REQUESTED:
      return state.setIn(['redemptions', 'isLoading'], true);

    case REDEMPTIONS + SUCCEDED:
      return state
        .setIn(['redemptions', 'isLoading'], false)
        .setIn(['redemptions', 'data'], fromJS(payload));

    case REDEMPTIONS + FAILED:
      return state.setIn(['redemptions', 'isLoading'], false);

    case REDEMPTIONS + ERROR:
      return state.setIn(['redemptions', 'isLoading'], false);

    case PRODUCTS + CLEAR:
      return state
        .setIn(['products', 'isLoading'], true)
        .setIn(['products', 'error'], '')
        .deleteIn(['products', 'data'], '');

    case PRODUCTS + REQUESTED:
      return state
        .setIn(['products', 'isLoading'], true)
        .setIn(['products', 'error'], '');

    case PRODUCTS + SUCCEDED:
      return state
        .setIn(['products', 'isLoading'], false)
        .setIn(['products', 'data'], fromJS(payload))
        .setIn(['products', 'error'], '');

    case PRODUCTS + FAILED:
      return state
        .setIn(['products', 'isLoading'], false)
        .setIn(['products', 'data'], null)
        .setIn(['products', 'error'], payload);

    case PRODUCTS + ERROR:
      return state
        .setIn(['products', 'isLoading'], false)
        .setIn(['products', 'error'], payload);

    case PRODUCT + REQUESTED:
      return state
        .setIn(['product', 'isLoading'], true)
        .setIn(['product', 'error'], '');

    case PRODUCT + SUCCEDED:
      return state
        .setIn(['product', 'isLoading'], false)
        .setIn(['product', 'data'], fromJS(payload))
        .setIn(['product', 'error'], '');

    case PRODUCT + FAILED:
      return state
        .setIn(['product', 'isLoading'], false)
        .setIn(['product', 'error'], payload);

    case PRODUCT + ERROR:
      return state
        .setIn(['product', 'isLoading'], false)
        .setIn(['product', 'error'], payload);

    case BUSINESS_REVIEWS + REQUESTED:
      return state
        .setIn(['businessReviews', 'isLoading'], true)
        .setIn(['businessReviews', 'error'], '');

    case BUSINESS_REVIEWS + SUCCEDED: {
      let newData = fromJS(payload);
      const currentHits = state.getIn(['businessReviews', 'data', 'hits']);

      if (payload.page > 1 && currentHits) {
        newData = newData.set('hits', currentHits.concat(newData.get('hits')));
      }
      return state
        .setIn(['businessReviews', 'isLoading'], false)
        .setIn(['businessReviews', 'data'], newData)
        .setIn(['businessReviews', 'error'], '');
    }
    case BUSINESS_REVIEWS + FAILED:
      return state
        .setIn(['businessReviews', 'isLoading'], false)
        .setIn(['businessReviews', 'data'], null)
        .setIn(['businessReviews', 'error'], payload);

    case BUSINESS_REVIEWS + ERROR:
      return state
        .setIn(['businessReviews', 'isLoading'], false)
        .setIn(['businessReviews', 'error'], payload);

    case PRODUCT_REVIEWS + CLEAR:
      return state
        .setIn(['productReviews', 'isLoading'], false)
        .setIn(['productReviews', 'error'], '')
        .deleteIn(['productReviews', 'data'], '');

    case PRODUCT_REVIEWS + REQUESTED:
      return state
        .setIn(['productReviews', 'isLoading'], true)
        .setIn(['productReviews', 'error'], '');

    case PRODUCT_REVIEWS + SUCCEDED: {
      return state
        .setIn(['productReviews', 'isLoading'], false)
        .setIn(['productReviews', 'data'], fromJS(payload))
        .setIn(['productReviews', 'error'], '');
    }

    case PRODUCT_REVIEWS + FAILED:
      return state
        .setIn(['productReviews', 'isLoading'], false)
        .setIn(['productReviews', 'data'], null)
        .setIn(['productReviews', 'error'], payload);

    case PRODUCT_REVIEWS + ERROR:
      return state
        .setIn(['productReviews', 'isLoading'], false)
        .setIn(['productReviews', 'error'], payload);

    case LOGO_UPLOAD + REQUESTED:
      return state
        .setIn(['logo', 'isUploading'], true)
        .setIn(['logo', 'error'], null);

    case LOGO_UPLOAD + SUCCEDED:
      return state
        .setIn(['logo', 'isUploading'], false)
        .setIn(['logo', 'path'], payload)
        .setIn(['logo', 'error'], null);

    case LOGO_UPLOAD + FAILED:
      return state
        .setIn(['logo', 'isUploading'], false)
        .setIn(['logo', 'error'], payload);

    case LOGO_UPLOAD + ERROR:
      return state.setIn(['logo', 'isUploading'], false).setIn(
        ['logo', 'error'],
        `Something went wrong.
          Please try again later or contact support and provide the following error information: ${payload}`
      );

    case UPDATE_PRODUCER_PROFILE + REQUESTED:
      return state
        .setIn(['producerProfile', 'isLoading'], true)
        .setIn(['producerProfile', 'error'], null);

    case UPDATE_PRODUCER_PROFILE + SUCCEDED:
      return state
        .setIn(['producerProfile', 'isLoading'], false)
        .setIn(['producerProfile', 'data'], payload)
        .setIn(['producerProfile', 'error'], null);

    case UPDATE_PRODUCER_PROFILE + FAILED:
      return state
        .setIn(['producerProfile', 'isLoading'], false)
        .setIn(['producerProfile', 'error'], payload);

    case UPDATE_PRODUCER_PROFILE + ERROR:
      return state.setIn(['producerProfile', 'isLoading'], false).setIn(
        ['producerProfile', 'error'],
        `Something went wrong.
          Please try again later or contact support and provide the following error information: ${payload}`
      );

    case SUBMIT_PRODUCT + REQUESTED:
      return state
        .setIn(['product', 'isUpdating'], true)
        .setIn(['product', 'error'], null)
        .setIn(['product', 'success'], null);

    case SUBMIT_PRODUCT + SUCCEDED:
      return state
        .setIn(['product', 'isUpdating'], false)
        .setIn(['product', 'data'], payload)
        .setIn(['product', 'error'], null);

    case SUBMIT_PRODUCT + FAILED:
      return state
        .setIn(['product', 'isUpdating'], false)
        .setIn(['product', 'error'], payload)
        .setIn(['product', 'success'], null);

    case SUBMIT_PRODUCT + ERROR:
      return state
        .setIn(['product', 'isUpdating'], false)
        .setIn(
          ['producerProfile', 'error'],
          `Something went wrong.
            Please try again later or contact support and provide the following error information: ${payload}`
        )
        .setIn(['product', 'success'], null);

    case DEMOGRAPHICS + REQUESTED:
      return state.setIn(['demographics', 'isLoading'], true);

    case DEMOGRAPHICS + SUCCEDED:
      return state
        .setIn(['demographics', 'isLoading'], false)
        .setIn(['demographics', 'data'], fromJS(payload));

    case DEMOGRAPHICS + FAILED:
      return state.setIn(['demographics', 'isLoading'], false);

    case DEMOGRAPHICS + ERROR:
      return state.setIn(['demographics', 'isLoading'], false);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------

const getBusinessId = state =>
  state.getIn(['lp', 'businesses', 'data', 0, 'id']);

const getUserRole = state => state.getIn(['app', 'lpUser', 'role']);

// ------------------------------------
// Sagas
// ------------------------------------
function* BusinessesRequest({ payload: userId, meta }) {
  try {
    const query: Object = {
      admins: {
        $in: [userId],
      },
    };
    if (meta) {
      query.createdOn = {
        $gte: meta.from,
        $lte: meta.to,
      };
    }
    const response = yield call(request, {
      url: `${API_URL}/businesses?populate=admins&query=${encodeURI(query)}`,
    });
    if (response.status === 200) {
      const { hits } = response.data;
      yield put(businessesRequestSuccess(hits));
      const businessId = hits[0] && hits[0].id;
      if (!businessId) {
        yield put(businessReviewsRequestFailed());
        yield put(productsRequestFailed());
        yield put(productReviewsRequestFailed());
      }
    } else {
      yield put(businessesRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(businessesRequestError(error));
  }
}

function* StatsRequest({ payload: id, meta: { from, to, interval } }) {
  const query = qs.stringify({ from, to, interval });
  try {
    const userRole = yield select(getUserRole.bind(null));
    let response;
    if (userRole === 'business') {
      response = {
        status: 200,
        data: DASHBOARD_STATS,
      };
    } else {
      response = yield call(request, {
        url: `${API_URL}/businesses/${id}/stats?${query}`,
        headers: { Authorization: `Bearer ${storage.get('lpToken')}` },
      });
    }
    if (response.status === 200) {
      yield put(statsRequestSuccess(response.data));
    } else {
      yield put(statsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(statsRequestError(error));
  }
}

function* RedemptionsRequest({ payload: id, meta: { from, to } }) {
  const query = qs.stringify({ from, to });
  try {
    const userRole = yield select(getUserRole.bind(null));
    let response;
    if (userRole === 'business') {
      response = {
        status: 200,
        data: DASHBOARD_REDEMPTIONS,
      };
    } else {
      response = yield call(request, {
        url: `${API_URL}/businesses/${id}/redemption?${query}`,
        headers: { Authorization: `Bearer ${storage.get('lpToken')}` },
      });
    }
    if (response.status === 200) {
      yield put(redemptionsRequestSuccess(response.data));
    } else {
      yield put(redemptionsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(redemptionsRequestError(error));
  }
}

function* ProductsRequest({ payload: { query, queryString } }) {
  try {
    const tmpQuery = cloneDeep(query);
    if (get(query, ['variants', '$elemMatch'])) {
      const priceInCents = {
        $gte: (
          get(tmpQuery, ['variants', '$elemMatch', 'price', '$gte'], 0) * 100
        ).toString(),
        $lte: (
          get(tmpQuery, ['variants', '$elemMatch', 'price', '$lte'], 0) * 100
        ).toString(),
      };
      set(tmpQuery, ['variants', '$elemMatch', 'price'], priceInCents);
    }
    const extraQuery = queryString ? `&${qs.stringify(queryString)}` : '';

    const response = yield call(request, {
      url: `${API_URL}/products?query=${encodeURI(tmpQuery)}${extraQuery}`,
    });
    if (response.status === 200) {
      yield put(productsRequestSuccess(response.data));
    } else {
      yield put(productsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(productsRequestError(error));
  }
}

function* ProductRequest({ payload: id }) {
  try {
    const response = yield call(request, {
      url: `${API_URL}/products/${id}`,
    });
    if (response.status === 200) {
      yield put(productRequestSuccess(response.data));
    } else {
      yield put(productRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(productRequestError(error));
  }
}

function* BusinessReviewsRequest({ payload: { query, queryString } }) {
  try {
    const totalQuery = encodeURI(query);
    const extraQuery = queryString ? `&${qs.stringify(queryString)}` : '';

    const response = yield call(request, {
      url: `${API_URL}/business-reviews?query=${totalQuery}${extraQuery}`,
    });
    if (response.status === 200) {
      yield put(businessReviewsRequestSuccess(response.data));
    } else {
      yield put(businessReviewsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(businessReviewsRequestError(error));
  }
}

function* ProductReviewsRequest({ payload: { query, queryString } }) {
  try {
    const userRole = yield select(getUserRole.bind(null));
    let response;
    if (['business', 'premium'].indexOf(userRole) >= 0) {
      response = {
        status: 200,
        data: PRODUCT_REVIEWS_DATA,
      };
    } else {
      const totalQuery = encodeURI(query);
      const extraQuery = queryString ? `&${qs.stringify(queryString)}` : '';

      response = yield call(request, {
        url: `${API_URL}/product-reviews?query=${totalQuery}${extraQuery}`,
      });
    }

    if (response.status === 200) {
      yield put(productReviewsRequestSuccess(response.data));
    } else {
      yield put(productReviewsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(productReviewsRequestError(error));
  }
}

function* LogoUploadRequest({ payload }) {
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
      yield put(logoUploadSuccess(response.data.link));
    } else {
      yield put(logoUploadFailed(response.data.message));
    }
  } catch (error) {
    yield put(logoUploadError(error));
  }
}

function* ProducerProfileUpdateRequest({ payload: id, meta: data }) {
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/businesses/${id}`,
      headers: { Authorization: `Bearer ${storage.get('lpToken')}` },
      data,
    });
    if (response.status === 200) {
      yield put(updateProducerProfileSuccess(response.data));
    } else {
      yield put(updateProducerProfileFailed(response.data.message));
    }
  } catch (error) {
    yield put(updateProducerProfileError(error));
  }
}

function* SubmitProductRequest({ payload, meta }) {
  const { id } = meta;
  try {
    const newPayload = cloneDeep(payload);
    const priceInCents = newPayload.variants[0].price * 100;
    newPayload.variants[0].price = priceInCents;
    let url = `${API_URL}/products`;
    if (id) url = `${API_URL}/products/${id}`;
    const response = yield call(request, {
      method: id ? 'PUT' : 'POST',
      url,
      headers: { Authorization: `Bearer ${storage.get('lpToken')}` },
      data: newPayload,
    });
    if (response.status === 200) {
      yield put(submitProductSuccess(response.data));
      const businessId = yield select(getBusinessId.bind(null));
      yield put(requestProducts({ business: businessId }));
      toastr.success('', 'Product was saved successfully.', '');
      history.push('/lp/products');
    } else {
      yield put(submitProductFailed(response.data.message));
    }
  } catch (error) {
    yield put(submitProductError(error));
  }
}

function* DemographicsRequest({ payload: businessId, meta: { from, to } }) {
  const query = qs.stringify({ from, to });
  try {
    const userRole = yield select(getUserRole.bind(null));
    let response;
    if (['business', 'premium'].indexOf(userRole) >= 0) {
      response = {
        status: 200,
        data: META_DATA,
      };
    } else {
      response = yield call(request, {
        url: `${API_URL}/businesses/${businessId}/meta?${query}`,
        headers: { Authorization: `Bearer ${storage.get('lpToken')}` },
      });
    }
    if (response.status === 200) {
      yield put(demographicsRequestSuccess(response.data));
    } else {
      yield put(demographicsRequestFailed());
    }
  } catch (error) {
    yield put(demographicsRequestError());
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(DEMOGRAPHICS + REQUESTED, DemographicsRequest),
    takeLatest(SUBMIT_PRODUCT + REQUESTED, SubmitProductRequest),
    takeLatest(
      UPDATE_PRODUCER_PROFILE + REQUESTED,
      ProducerProfileUpdateRequest
    ),
    takeLatest(LOGO_UPLOAD + REQUESTED, LogoUploadRequest),
    takeLatest(PRODUCT_REVIEWS + REQUESTED, ProductReviewsRequest),
    takeLatest(BUSINESS_REVIEWS + REQUESTED, BusinessReviewsRequest),
    takeLatest(PRODUCTS + REQUESTED, ProductsRequest),
    takeLatest(PRODUCT + REQUESTED, ProductRequest),
    takeLatest(REDEMPTIONS + REQUESTED, RedemptionsRequest),
    takeLatest(BUSINESSES + REQUESTED, BusinessesRequest),
    takeLatest(STATS + REQUESTED, StatsRequest),
  ]);
}
