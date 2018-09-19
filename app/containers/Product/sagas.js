// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS, List } from 'immutable';
import { history } from 'components/ConnectedRouter';
import {
  call,
  put,
  select,
  takeLatest,
  takeEvery,
  all,
} from 'redux-saga/effects';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import deepReplaceToString from 'utils/deepReplaceToString';
import deepReplaceToObject from 'utils/deepReplaceToObject';
import { getToken } from 'containers/App/selectors';
import AnalyticsEvents from 'enum/analytics/events';
import CONFIG from 'conf';

// ------------------------------------
// Constants
// ------------------------------------
const PRODUCT = 'Lift/Product/PRODUCT';
const OTHER_PRODUCTS = 'Lift/Product/OTHER_PRODUCTS';
const REVIEWS = 'Lift/Product/REVIEWS';
const PHOTOS = 'Lift/Product/PHOTOS';
const META = 'Lift/Product/META';
const FOLLOW_LIKE_PRODUCT = 'Lift/Product/FOLLOW_LIKE_PRODUCT';
const FOLLOWS = 'Lift/Product/FOLLOWS';
const LIKES = 'Lift/Product/LIKES';
const PURCHASE_BUTTON = 'Lift/Product/PURCHASE_BUTTON';

const SET_REVIEWS_FILTERS = 'Lift/Product/REVIEWS/SET_FILTERS';

const SUBMIT_REVIEW = 'Lift/Product/SUBMIT_REVIEW';
const SAVE_REVIEW_DRAFT = 'Lift/Product/SAVE_REVIEW_DRAFT';
const DELETE_REVIEW = 'Lift/Product/DELETE_REVIEW';

const REVIEW = 'Lift/Product/REVIEW';
const VOTE_REVIEW = 'Lift/Product/VOTE_REVIEW';
const SORT_REVIEW = 'Lift/Product/SORT_REVIEW';

const SET_BREADCRUMB_PATH = 'Lift/Product/SET_BREADCRUMB_PATH';
const SET_HELMET_TITLE = 'Lift/Product/SET_HELMET_TITLE';

const COMPLETE_REVIEW_FORM = 'Lift/Profile/COMPLETE_REVIEW_FORM';
const CLEAR_REVIEW_FORM = 'Lift/Profile/CLEAR_REVIEW_FORM';

const UPLOAD_REVIEW_PHOTOS = 'Lift/Product/UPLOAD_REVIEW_PHOTOS';
const REMOVE_REVIEW_PHOTO = 'Lift/Product/REMOVE_REVIEW_PHOTO';

const CLEAR_SUBMIT_REVIEW_STATUS = 'Lift/Product/CLEAR_SUBMIT_REVIEW_STATUS';
// ------------------------------------
// Actions
// ------------------------------------

export const requestProduct = (slug: string) => ({
  type: PRODUCT + REQUESTED,
  payload: slug,
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

export const requestProductReviews = (
  id: string,
  path: string,
  value: ?Object
) => ({
  type: REVIEWS + REQUESTED,
  payload: value,
  meta: {
    id,
    path,
  },
});
const productReviewsRequestSuccess = (id: string, data: Object) => ({
  type: REVIEWS + SUCCEDED,
  payload: data,
  meta: { id },
});
const productReviewsRequestFailed = (id: string, error: string) => ({
  type: REVIEWS + FAILED,
  payload: error,
  meta: { id },
});

export const setReviewsFilters = (parsedSearch: Object) => ({
  type: SET_REVIEWS_FILTERS,
  payload: parsedSearch,
});

export const requestProductPhotos = (id: string) => ({
  type: PHOTOS + REQUESTED,
  payload: id,
});
const productPhotosRequestSuccess = (data: Object) => ({
  type: PHOTOS + SUCCEDED,
  payload: data,
});
const productPhotosRequestFailed = (error: string) => ({
  type: PHOTOS + FAILED,
  payload: error,
});

export const requestOtherProducts = (productId: string) => ({
  type: OTHER_PRODUCTS + REQUESTED,
  payload: productId,
});
const otherProductsRequestSuccess = (payload: Object) => ({
  type: OTHER_PRODUCTS + SUCCEDED,
  payload,
});
const otherProductsRequestFailed = error => ({
  type: OTHER_PRODUCTS + FAILED,
  payload: error,
});
const otherProductsRequestError = error => ({
  type: OTHER_PRODUCTS + ERROR,
  payload: error,
});

export const requestMeta = (id: string) => ({
  type: META + REQUESTED,
  payload: id,
});
const metaRequestSuccess = (payload: Object) => ({
  type: META + SUCCEDED,
  payload,
});
const metaRequestFailed = error => ({
  type: META + FAILED,
  payload: error,
});
const metaRequestError = error => ({
  type: META + ERROR,
  payload: error,
});

export const submitReview = (payload: Object, reviewId: string) => ({
  type: SUBMIT_REVIEW + REQUESTED,
  payload,
  reviewId,
});
const reviewSubmitSuccess = (payload: Object) => {
  if (CONFIG.IS_ANALYTIC && payload.data && payload.data.product) {
    const reviewProduct = payload.data.product;
    analytics.track(AnalyticsEvents.PRODUCT_REVIEW_CREATED, {
      product: reviewProduct.name,
      business: reviewProduct.business ? reviewProduct.business.name : null,
    });
  }
  return {
    type: SUBMIT_REVIEW + SUCCEDED,
    payload,
  };
};
const reviewSubmitError = error => ({
  type: SUBMIT_REVIEW + ERROR,
  payload: error,
});

export const saveReviewDraft = (payload: Object) => ({
  type: SAVE_REVIEW_DRAFT,
  payload,
});

export const deleteReview = (reviewId: string) => ({
  type: DELETE_REVIEW + REQUESTED,
  reviewId,
});
const reviewDeleteSuccess = () => ({
  type: DELETE_REVIEW + SUCCEDED,
});
const reviewDeleteError = error => ({
  type: DELETE_REVIEW + ERROR,
  payload: error,
});

export const requestReview = (id: string) => ({
  type: REVIEW + REQUESTED,
  id,
});
const reviewRequestSuccess = (data: Object) => ({
  type: REVIEW + SUCCEDED,
  payload: data,
});
const reviewRequestFailed = (error: string) => ({
  type: REVIEW + FAILED,
  payload: error,
});

export const voteReview = (reviewId: string, type: string) => ({
  type: VOTE_REVIEW + REQUESTED,
  reviewId,
  meta: { type },
});
const reviewVoteSuccess = (reviewId: string) => ({
  type: VOTE_REVIEW + SUCCEDED,
  reviewId,
});
const reviewVoteError = error => ({
  type: VOTE_REVIEW + ERROR,
  payload: error,
});

export const sortReview = (sortBy: string) => ({
  type: SORT_REVIEW,
  payload: sortBy,
});

export const setBreadcrumbPath = (path: List<Map<string, Object>>) => ({
  type: SET_BREADCRUMB_PATH,
  payload: path,
});

export const setHelmetTitle = (title: string) => ({
  type: SET_HELMET_TITLE,
  payload: title,
});

export const completeReviewForm = (path: string, value: boolean) => ({
  type: COMPLETE_REVIEW_FORM,
  payload: value,
  meta: { path },
});

export const clearReviewForm = () => ({
  type: CLEAR_REVIEW_FORM,
});

export const clearSubmitReviewStatus = () => ({
  type: CLEAR_SUBMIT_REVIEW_STATUS,
});

export const followLikeProduct = (productId: string, actionType: string) => ({
  type: FOLLOW_LIKE_PRODUCT + REQUESTED,
  productId,
  actionType,
});
const productFollowLikeSuccess = () => ({
  type: FOLLOW_LIKE_PRODUCT + SUCCEDED,
});
const productFollowLikeError = error => ({
  type: FOLLOW_LIKE_PRODUCT + ERROR,
  payload: error,
});

export const requestProductFollows = (id: string) => ({
  type: FOLLOWS + REQUESTED,
  payload: id,
});
const productFollowsRequestSuccess = (count: number) => ({
  type: FOLLOWS + SUCCEDED,
  payload: count,
});
const productFollowsRequestFailed = error => ({
  type: FOLLOWS + FAILED,
  payload: error,
});

export const requestProductLikes = (id: string) => ({
  type: LIKES + REQUESTED,
  payload: id,
});
const productLikesRequestSuccess = (count: number) => ({
  type: LIKES + SUCCEDED,
  payload: count,
});
const productLikesRequestFailed = error => ({
  type: LIKES + FAILED,
  payload: error,
});

export const requestReviewPhotoUpload = (index: number, payload: Object) => ({
  type: UPLOAD_REVIEW_PHOTOS + REQUESTED,
  payload,
  meta: {
    index,
  },
});
const reviewPhotoUploadSuccess = (index: number, payload: Object) => ({
  type: UPLOAD_REVIEW_PHOTOS + SUCCEDED,
  payload,
  meta: {
    index,
  },
});
const reviewPhotoUploadError = (index, error) => ({
  type: UPLOAD_REVIEW_PHOTOS + ERROR,
  payload: error,
  meta: {
    index,
  },
});

export const removePhoto = (payload: number) => ({
  type: REMOVE_REVIEW_PHOTO,
  payload,
});

export const trackPurchaseButton = (business: string, product: string) => {
  if (CONFIG.IS_ANALYTIC) {
    analytics.track(AnalyticsEvents.PURCHASE_BUTTON, {
      business,
      product,
    });
  }
  return {
    type: PURCHASE_BUTTON,
  };
};
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  data: null,
  isLoading: false,
  error: '',
  business: null,
  slug: null,
  other: {
    data: null,
    isLoading: false,
    error: '',
  },
  meta: {
    data: null,
    isLoading: false,
    error: '',
    id: null,
  },
  breadcrumbPath: null,
  helmetTitle: 'Lift & Co.',
  id: null,
  reviews: {
    data: {
      hits: {},
    },
    model: {
      page: null,
      per_page: null,
      sortBy: '-createdOn',
    },
    isLoading: false,
    error: '',
  },
  photos: {
    data: {
      hits: {},
    },
    model: {
      page: 1,
      per_page: 10,
    },
    isLoading: false,
    error: '',
  },
  review: {
    isLoading: false,
    errorMessage: '',
    successMessage: '',
  },
  reviewData: {
    isLoading: false,
    error: '',
    data: {},
  },
  reviewDraft: {
    data: {},
  },
  uploadedPhotos: [],
  reviewVote: {
    isLoading: false,
    error: '',
  },
  reviewCompletion: {
    rating: false,
    title: false,
    message: false,
  },
  productFollowLike: {
    isLoading: false,
    error: '',
  },
  follows: {
    count: 0,
    isLoading: false,
    error: '',
  },
  likes: {
    count: 0,
    isLoading: false,
    error: '',
  },
});

let newState = {};

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  let uploadedPhotos = state.get('uploadedPhotos');
  let isUploading = false;
  switch (type) {
    case PRODUCT + REQUESTED:
      return state
        .set('isLoading', true)
        .set('slug', payload)
        .set('data', null);

    case PRODUCT + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('data', fromJS(payload))
        .set('error', '');

    case PRODUCT + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case PRODUCT + ERROR:
      return state.set('isLoading', false).set('error', payload);

    case REVIEWS + REQUESTED:
      newState = state.setIn(['reviews', 'isLoading'], true);
      if (meta.path)
        return newState.setIn(
          ['reviews', 'model', ...meta.path],
          fromJS(payload)
        );
      return newState;

    case REVIEWS + SUCCEDED:
      return state
        .setIn(['reviews', 'isLoading'], false)
        .setIn(['reviews', 'data'], fromJS(payload.data));

    case REVIEWS + FAILED:
      return state.setIn(['reviews', 'isLoading'], false);

    case SET_REVIEWS_FILTERS: {
      const { page = 1, per_page = 10, sort = '-createdOn' } = payload; // eslint-disable-line camelcase
      newState = state.setIn(
        ['reviews', 'model'],
        fromJS({
          page: Number(page),
          per_page: Number(per_page),
          sortBy: sort,
        })
      );

      return newState;
    }

    case PHOTOS + REQUESTED:
      newState = state.setIn(['photos', 'isLoading'], true);
      return newState;

    case PHOTOS + SUCCEDED:
      newState = state
        .setIn(['photos', 'isLoading'], false)
        .setIn(['photos', 'data'], fromJS(payload.data));
      return newState.setIn(
        ['photos', 'data', 'hits'],
        newState
          .getIn(['photos', 'data', 'hits'])
          .flatMap(item => item.get('photos'))
      );

    case PHOTOS + FAILED:
      return state.setIn(['photos', 'isLoading'], false);

    case OTHER_PRODUCTS + REQUESTED:
      return state.setIn(['other', 'isLoading'], true).set('business', payload);

    case OTHER_PRODUCTS + SUCCEDED:
      return state
        .setIn(['other', 'isLoading'], false)
        .setIn(['other', 'data'], fromJS(payload))
        .setIn(['other', 'error'], '');

    case OTHER_PRODUCTS + FAILED:
      return state
        .setIn(['other', 'isLoading'], false)
        .setIn(['other', 'error'], payload);

    case OTHER_PRODUCTS + ERROR:
      return state
        .setIn(['other', 'isLoading'], false)
        .setIn(['other', 'error'], payload);

    case META + REQUESTED:
      return state
        .setIn(['meta', 'isLoading'], true)
        .setIn(['meta', 'id'], payload)
        .setIn(['meta', 'error'], '');

    case META + SUCCEDED:
      return state
        .setIn(['meta', 'isLoading'], false)
        .setIn(['meta', 'data'], fromJS(payload))
        .setIn(['meta', 'error'], '');

    case SUBMIT_REVIEW + REQUESTED:
      return state
        .setIn(['review', 'isLoading'], true)
        .setIn(['review', 'error'], '');

    case SUBMIT_REVIEW + SUCCEDED:
      return state
        .setIn(['review', 'isLoading'], false)
        .setIn(['review', 'errorMessage'], '')
        .setIn(['reviewDraft', 'data'], fromJS({}))
        .setIn(
          ['review', 'successMessage'],
          "Your review has been submitted and is pending approval. We'll let you know once it's approved. This usually takes 24-48 hours."
        );

    case SUBMIT_REVIEW + ERROR:
      return state
        .setIn(['review', 'isLoading'], false)
        .setIn(['review', 'successMessage'], '')
        .setIn(['review', 'errorMessage'], payload.message);

    case SAVE_REVIEW_DRAFT:
      return state.setIn(['reviewDraft', 'data'], fromJS(payload));

    case DELETE_REVIEW + REQUESTED:
      return state
        .setIn(['review', 'isLoading'], true)
        .setIn(['review', 'error'], '');

    case DELETE_REVIEW + SUCCEDED:
      return state
        .setIn(['review', 'isLoading'], false)
        .setIn(['review', 'error'], '');

    case DELETE_REVIEW + ERROR:
      return state.setIn(['review', 'isLoading'], false).setIn(
        ['review', 'error'],
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case REVIEW + REQUESTED:
      return state
        .setIn(['reviewData', 'isLoading'], true)
        .setIn(['reviewData', 'error'], '');

    case REVIEW + SUCCEDED:
      return state
        .setIn(['reviewData', 'isLoading'], false)
        .setIn(['reviewData', 'data'], fromJS(payload.data))
        .setIn(['reviewData', 'error'], '');

    case REVIEW + FAILED:
      return state
        .setIn(['reviewData', 'isLoading'], false)
        .setIn(['reviewData', 'error'], payload);

    case VOTE_REVIEW + REQUESTED:
      return state
        .setIn(['reviewVote', 'isLoading'], true)
        .setIn(['reviewVote', 'error'], '');

    case VOTE_REVIEW + SUCCEDED:
      return state
        .setIn(['reviewVote', 'isLoading'], false)
        .setIn(['reviewVote', 'error'], '');

    case VOTE_REVIEW + ERROR:
      return state.setIn(['reviewVote', 'isLoading'], false).setIn(
        ['reviewVote', 'error'],
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case SORT_REVIEW:
      return state.setIn(['reviews', 'model', 'sortBy'], payload);

    case SET_BREADCRUMB_PATH:
      return state.set('breadcrumbPath', payload);

    case SET_HELMET_TITLE:
      return state.set('helmetTitle', payload);

    case COMPLETE_REVIEW_FORM:
      return state.setIn(['reviewCompletion', ...meta.path], payload);

    case CLEAR_REVIEW_FORM:
      return state
        .setIn(['reviewCompletion', 'rating'], false)
        .setIn(['reviewCompletion', 'title'], false)
        .setIn(['reviewCompletion', 'message'], false)
        .set('uploadedPhotos', fromJS([]));

    case CLEAR_SUBMIT_REVIEW_STATUS:
      return state
        .setIn(['review', 'isLoading'], false)
        .setIn(['review', 'errorMessage'], '')
        .setIn(['review', 'successMessage'], '');

    case FOLLOW_LIKE_PRODUCT + REQUESTED:
      return state
        .setIn(['productFollowLike', 'isLoading'], true)
        .setIn(['productFollowLike', 'error'], '');

    case FOLLOW_LIKE_PRODUCT + SUCCEDED:
      return state
        .setIn(['productFollowLike', 'isLoading'], false)
        .setIn(['productFollowLike', 'error'], '');

    case FOLLOW_LIKE_PRODUCT + ERROR:
      return state
        .setIn(['productFollowLike', 'isLoading'], false)
        .setIn(['productFollowLike', 'error'], payload);

    case FOLLOWS + REQUESTED:
      return state
        .setIn(['follows', 'isLoading'], true)
        .setIn(['follows', 'error'], '');

    case FOLLOWS + SUCCEDED:
      return state
        .setIn(['follows', 'count'], payload)
        .setIn(['follows', 'isLoading'], false)
        .setIn(['follows', 'error'], '');

    case FOLLOWS + ERROR:
      return state
        .setIn(['follows', 'isLoading'], false)
        .setIn(['follows', 'error'], payload);

    case LIKES + REQUESTED:
      return state
        .setIn(['likes', 'isLoading'], true)
        .setIn(['likes', 'error'], '');

    case LIKES + SUCCEDED:
      return state
        .setIn(['likes', 'count'], payload)
        .setIn(['likes', 'isLoading'], false)
        .setIn(['likes', 'error'], '');

    case LIKES + ERROR:
      return state
        .setIn(['likes', 'isLoading'], false)
        .setIn(['likes', 'error'], payload);

    case UPLOAD_REVIEW_PHOTOS + REQUESTED:
      uploadedPhotos = uploadedPhotos.set(
        meta.index,
        fromJS({ isLoading: true, link: '', error: null })
      );
      return state
        .set('isUploading', true)
        .set('uploadedPhotos', uploadedPhotos)
        .set('uploadError', null);

    case UPLOAD_REVIEW_PHOTOS + SUCCEDED:
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

    case UPLOAD_REVIEW_PHOTOS + ERROR:
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

    case REMOVE_REVIEW_PHOTO:
      uploadedPhotos = uploadedPhotos.delete(payload);
      return state.set('uploadedPhotos', uploadedPhotos);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getModel = (category, state) =>
  deepReplaceToString(state.getIn(['product', category, 'model']).toJS());

// ------------------------------------
// Sagas
// ------------------------------------
function* ProductRequest({ payload: slug }) {
  try {
    const response = yield call(request, {
      url: `${API_URL}/products?query=${encodeURI({ slug })}&populate=business`,
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

function* OtherProductsRequest({ payload: productId }) {
  try {
    const response = yield call(request, {
      url: `${API_URL}/products/${productId}/similar`,
    });
    if (response.status === 200) {
      yield put(otherProductsRequestSuccess(response.data));
    } else {
      yield put(otherProductsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(otherProductsRequestError(error));
  }
}

function* MetaRequest({ payload }) {
  try {
    const response = yield call(request, {
      url: `${API_URL}/products/${payload}/meta`,
    });
    if (response.status === 200) {
      yield put(metaRequestSuccess(response.data));
    } else {
      yield put(metaRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(metaRequestError(error));
  }
}

function* ReviewSubmitRequest({ payload, reviewId }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: reviewId ? 'PUT' : 'POST',
      url: `${API_URL}/product-reviews${reviewId ? `/${reviewId}` : ''}`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        ...payload,
        flavours: deepReplaceToString(payload.flavours),
        negativeEffects: deepReplaceToObject(payload.negativeEffects),
        positiveEffects: deepReplaceToObject(payload.positiveEffects),
        prescribedFor: deepReplaceToString(payload.prescribedFor),
        symptomsHelped: deepReplaceToObject(payload.symptomsHelped),
      },
    });
    if (response.status === 200 || response.status === 204) {
      yield put(reviewSubmitSuccess(response));
      if (reviewId) {
        history.push(`${payload.url.split('/edit')[0]}`);
      } else {
        localStorage.setItem('points', response.data.points);
        history.push('/review-submit-success');
      }
    } else {
      yield put(reviewSubmitError(response.data));
    }
  } catch (error) {
    yield put(reviewSubmitError(error));
  }
}

function* ProductReviewsRequest({ meta: { id } }) {
  const model = yield select(getModel.bind(null, 'reviews'));
  try {
    const query = {
      product: id,
      message: { $exists: true, $not: { $eq: '' } },
      title: { $exists: true, $not: { $eq: '' } },
    };
    const encodedQuery = encodeURI(query);
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/product-reviews?query=${encodedQuery}&populate=user&sort=${
        model.sortBy
      }&page=${model.page}&per_page=${model.per_page}`,
    });
    if (response.status === 200) {
      yield put(productReviewsRequestSuccess(id, response));
    } else {
      yield put(productReviewsRequestFailed(id, response.data));
    }
  } catch (error) {
    yield put(productReviewsRequestFailed(id, error));
  }
}

function* ProductPhotosRequest({ payload }) {
  try {
    const query = {
      product: payload,
      $where: 'this.photos.length>0',
    };
    const encodedQuery = encodeURI(query);
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/product-reviews?query=${encodedQuery}&select=photos&page=1&per_page=1000`,
    });
    if (response.status === 200) {
      yield put(productPhotosRequestSuccess(response));
    } else {
      yield put(productPhotosRequestFailed(response.data));
    }
  } catch (error) {
    yield put(productPhotosRequestFailed(error));
  }
}

function* DeleteReviewRequest({ reviewId }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/product-reviews/${reviewId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(reviewDeleteSuccess());
    } else if (response.status === 204) {
      yield put(reviewDeleteSuccess());
    } else {
      yield put(reviewDeleteError(response.data));
    }
  } catch (error) {
    yield put(reviewDeleteError(error));
  }
}

function* ReviewRequest({ id }) {
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/product-reviews/${id}?populate=user`,
    });
    if (response.status === 200) {
      yield put(reviewRequestSuccess(response));
    } else {
      yield put(reviewRequestFailed(response.data));
    }
  } catch (error) {
    yield put(reviewRequestFailed(error));
  }
}

function* VoteReviewRequest({ reviewId, meta: { type } }) {
  try {
    const token = yield select(getToken);
    let url = `${API_URL}/product-reviews/${reviewId}/`;
    if (type === 'up') {
      url += 'upvotes';
    } else if (type === 'down') {
      url += 'downvotes';
    }
    const response = yield call(request, {
      method: 'POST',
      url,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(reviewVoteSuccess(response));
    } else {
      yield put(reviewVoteError(response.data));
    }
  } catch (error) {
    yield put(reviewVoteError(error));
  }
}

function* FollowLikeProductRequest({ productId, actionType }) {
  try {
    const token = yield select(getToken);
    const url = `${API_URL}/${actionType}s`;
    const response = yield call(request, {
      method: 'POST',
      url,
      data: {
        item: productId,
        itemType: 'Product',
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(productFollowLikeSuccess());
    } else {
      yield put(productFollowLikeError(response.data));
    }
  } catch (error) {
    yield put(productFollowLikeError(error));
  }
}

function* ProductFollowsRequest({ payload }) {
  try {
    const query = { item: payload };
    const encodedQuery = encodeURI(query);
    const url = `${API_URL}/follows?query=${encodedQuery}&op=count`;
    const response = yield call(request, {
      method: 'GET',
      url,
    });
    if (response.status === 200) {
      yield put(productFollowsRequestSuccess(response.data.count));
    } else {
      yield put(productFollowsRequestFailed(response.data));
    }
  } catch (error) {
    yield put(productFollowsRequestFailed(error));
  }
}

function* ProductLikesRequest({ payload }) {
  try {
    const query = { item: payload };
    const encodedQuery = encodeURI(query);
    const url = `${API_URL}/likes?query=${encodedQuery}&op=count`;
    const response = yield call(request, {
      method: 'GET',
      url,
    });
    if (response.status === 200) {
      yield put(productLikesRequestSuccess(response.data.count));
    } else {
      yield put(productLikesRequestFailed(response.data));
    }
  } catch (error) {
    yield put(productFollowsRequestFailed(error));
  }
}

function* UploadReviewPhotoRequest({ payload, meta: { index } }) {
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
      yield put(reviewPhotoUploadSuccess(index, response.data));
    } else {
      yield put(reviewPhotoUploadError(index, response.data.message));
    }
  } catch (error) {
    yield put(reviewPhotoUploadError(index, error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeEvery(UPLOAD_REVIEW_PHOTOS + REQUESTED, UploadReviewPhotoRequest),
    takeLatest(LIKES + REQUESTED, ProductLikesRequest),
    takeLatest(FOLLOW_LIKE_PRODUCT + REQUESTED, FollowLikeProductRequest),
    takeLatest(VOTE_REVIEW + REQUESTED, VoteReviewRequest),
    takeLatest(REVIEW + REQUESTED, ReviewRequest),
    takeLatest(DELETE_REVIEW + REQUESTED, DeleteReviewRequest),
    takeLatest(FOLLOWS + REQUESTED, ProductFollowsRequest),
    takeLatest(PHOTOS + REQUESTED, ProductPhotosRequest),
    takeLatest(REVIEWS + REQUESTED, ProductReviewsRequest),
    takeLatest(SUBMIT_REVIEW + REQUESTED, ReviewSubmitRequest),
    takeLatest(META + REQUESTED, MetaRequest),
    takeLatest(OTHER_PRODUCTS + REQUESTED, OtherProductsRequest),
    takeLatest(PRODUCT + REQUESTED, ProductRequest),
  ]);
}
