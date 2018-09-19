// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, SUCCEDED, FAILED, STARTED } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const GET_CATEGORIES = 'Lift/Forum/GET_CATEGORIES';
const GET_QUESTION = 'Lift/Forum/GET_QUESTION';
const SUBMIT_ANSWER = 'Lift/Forum/SUBMIT_ANSWER';
const UP_VOTE_ANSWER = 'Lift/Forum/UP_VOTE_ANSWER';
const DOWN_VOTE_ANSWER = 'Lift/Forum/DOWN_VOTE_ANSWER';
const SUBMIT_REPLY = 'Lift/Forum/SUBMIT_REPLY';
const MARK_ANSWER_AS_CORRECT = 'Lift/Forum/MARK_ANSWER_AS_CORRECT';
const DELETE_QUESTION = 'Lift/Forum/DELETE_QUESTION';
const DELETE_ANSWER = 'Lift/Forum/DELETE_ANSWER';
const DELETE_REPLY = 'Lift/Forum/DELETE_REPLY';
// ------------------------------------
// Actions
// ------------------------------------
export const requestCategories = (slug?: string) => ({
  type: GET_CATEGORIES + REQUESTED,
  payload: { slug },
});
const startCategoriesRequest = () => ({
  type: GET_CATEGORIES + STARTED,
});
const categoriesRequestSuccess = (data: Object) => ({
  type: GET_CATEGORIES + SUCCEDED,
  payload: data,
});
const categoriesRequestFailed = (error: string) => ({
  type: GET_CATEGORIES + FAILED,
  payload: error,
});

export const requestQuestion = (slug: string) => ({
  type: GET_QUESTION + REQUESTED,
  payload: {
    slug,
  },
});
const questionsRequestSuccess = (data: Object) => ({
  type: GET_QUESTION + SUCCEDED,
  payload: data,
});
const questionsRequestFailed = (error: string) => ({
  type: GET_QUESTION + FAILED,
  payload: error,
});

export const submitAnswer = (data: Object) => ({
  type: SUBMIT_ANSWER + REQUESTED,
  payload: data,
});
const answerSubmitSuccess = (data: Object) => ({
  type: SUBMIT_ANSWER + SUCCEDED,
  payload: data,
});
const answerSubmitFailed = (error: string) => ({
  type: SUBMIT_ANSWER + FAILED,
  payload: error,
});

export const upVoteAnswer = (answerIndex: Object, answerId: string) => ({
  type: UP_VOTE_ANSWER + REQUESTED,
  payload: answerIndex,
  meta: answerId,
});
const upVoteAnswerSuccess = (answerIndex: string, upVotes: Array<string>) => ({
  type: UP_VOTE_ANSWER + SUCCEDED,
  payload: answerIndex,
  meta: upVotes,
});
const upVoteAnswerFailed = (error: string) => ({
  type: UP_VOTE_ANSWER + FAILED,
  payload: error,
});

export const downVoteAnswer = (answerIndex: Object, answerId: string) => ({
  type: DOWN_VOTE_ANSWER + REQUESTED,
  payload: answerIndex,
  meta: answerId,
});
const downVoteAnswerSuccess = (
  answerIndex: string,
  downVotes: Array<string>
) => ({
  type: DOWN_VOTE_ANSWER + SUCCEDED,
  payload: answerIndex,
  meta: downVotes,
});
const downVoteAnswerFailed = (error: string) => ({
  type: DOWN_VOTE_ANSWER + FAILED,
  payload: error,
});

export const markAnswerAsCorrect = (answerId: string) => ({
  type: MARK_ANSWER_AS_CORRECT + REQUESTED,
  payload: answerId,
});
const markAnswerAsCorrectSuccess = (data: Object) => ({
  type: MARK_ANSWER_AS_CORRECT + SUCCEDED,
  payload: data,
});
const markAnswerAsCorrectFailed = (error: string) => ({
  type: MARK_ANSWER_AS_CORRECT + FAILED,
  payload: error,
});

export const submitReply = (data: Object, answerId: string) => ({
  type: SUBMIT_REPLY + REQUESTED,
  payload: data,
  meta: answerId,
});
const replySubmitSuccess = (data: Object) => ({
  type: SUBMIT_REPLY + SUCCEDED,
  payload: data,
});
const replySubmitFailed = (error: string) => ({
  type: SUBMIT_REPLY + FAILED,
  payload: error,
});

export const deleteQuestion = (questionId: string) => ({
  type: DELETE_QUESTION + REQUESTED,
  payload: {
    questionId,
  },
});
const questionDeleteSuccess = () => ({
  type: DELETE_QUESTION + SUCCEDED,
});
const questionDeleteError = error => ({
  type: DELETE_QUESTION + FAILED,
  payload: error,
});

export const deleteAnswer = (questionId: string, answerId: string) => ({
  type: DELETE_ANSWER + REQUESTED,
  payload: {
    questionId,
    answerId,
  },
});
const answerDeleteSuccess = () => ({
  type: DELETE_ANSWER + SUCCEDED,
});
const answerDeleteError = error => ({
  type: DELETE_ANSWER + FAILED,
  payload: error,
});

export const deleteReply = (
  questionId: string,
  answerId: string,
  replyId: string
) => ({
  type: DELETE_REPLY + REQUESTED,
  payload: {
    questionId,
    answerId,
    replyId,
  },
});
const replyDeleteSuccess = () => ({
  type: DELETE_REPLY + SUCCEDED,
});
const replyDeleteError = error => ({
  type: DELETE_REPLY + FAILED,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  categories: {
    isLoading: true,
    data: {},
  },
  question: {
    isLoading: true,
    isUpdating: false,
    data: {},
  },
  answerForm: {
    isLoading: false,
    error: '',
  },
  replyForm: {
    isLoading: false,
    error: '',
  },
});

let newState = null;

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  let answers = null;
  switch (type) {
    case GET_CATEGORIES + STARTED:
      return state.setIn(['categories', 'isLoading'], true);
    case GET_CATEGORIES + SUCCEDED:
      return state
        .setIn(['categories', 'isLoading'], false)
        .setIn(['categories', 'data'], fromJS(payload.data));
    case GET_CATEGORIES + FAILED:
      return state.setIn(['categories', 'isLoading'], false);
    case GET_QUESTION + REQUESTED:
      return state.setIn(['question', 'isLoading'], true);
    case GET_QUESTION + SUCCEDED:
      newState = state
        .setIn(['question', 'isLoading'], false)
        .setIn(['question', 'data'], fromJS(payload.data.hits[0]));
      answers = newState
        .getIn(['question', 'data', 'answers'])
        .map(item =>
          item.set(
            'isCorrectAnswer',
            item.get('_id') === payload.data.hits[0].correctAnswer
          )
        )
        .sortBy(item => -item.get('isCorrectAnswer'));
      return newState.setIn(['question', 'data', 'answers'], answers);

    case GET_QUESTION + FAILED:
      return state.setIn(['question', 'isLoading'], false);

    case SUBMIT_ANSWER + REQUESTED:
      return state.setIn(['answerForm', 'isLoading'], true);
    case SUBMIT_ANSWER + SUCCEDED:
      return state
        .setIn(['answerForm', 'isLoading'], false)
        .setIn(['answerForm', 'error'], '')
        .setIn(['answerForm', 'data'], fromJS(payload.data));
    case SUBMIT_ANSWER + FAILED:
      return state
        .setIn(['answerForm', 'isLoading'], false)
        .setIn(['answerForm', 'error'], fromJS(payload.message));

    case UP_VOTE_ANSWER + SUCCEDED:
      return state
        .setIn(
          ['question', 'data', 'answers', payload, 'upVotes'],
          fromJS(meta.upVotes)
        )
        .setIn(
          ['question', 'data', 'answers', payload, 'downVotes'],
          fromJS(meta.downVotes)
        );

    case DOWN_VOTE_ANSWER + SUCCEDED:
      return state
        .setIn(
          ['question', 'data', 'answers', payload, 'upVotes'],
          fromJS(meta.upVotes)
        )
        .setIn(
          ['question', 'data', 'answers', payload, 'downVotes'],
          fromJS(meta.downVotes)
        );

    case MARK_ANSWER_AS_CORRECT + REQUESTED:
      return state.setIn(['question', 'isUpdating'], true);

    case MARK_ANSWER_AS_CORRECT + SUCCEDED:
      return state
        .setIn(['question', 'isUpdating'], false)
        .setIn(['question', 'data', 'correctAnswer'], payload.correctAnswer)
        .setIn(['question', 'data', 'closed'], payload.closed);

    case MARK_ANSWER_AS_CORRECT + FAILED:
      return state.setIn(['question', 'isUpdating'], false);

    case SUBMIT_REPLY + REQUESTED:
      return state.setIn(['replyForm', 'isLoading'], true);
    case SUBMIT_REPLY + SUCCEDED:
      return state
        .setIn(['replyForm', 'isLoading'], false)
        .setIn(['replyForm', 'error'], '')
        .setIn(['replyForm', 'data'], fromJS(payload.data));
    case SUBMIT_REPLY + FAILED:
      return state
        .setIn(['replyForm', 'isLoading'], false)
        .setIn(['replyForm', 'error'], fromJS(payload.message));

    case DELETE_QUESTION + REQUESTED:
      return state
        .setIn(['questions', 'isLoading'], true)
        .setIn(['questions', 'error'], '')
        .setIn(['questions', 'success'], '');
    case DELETE_QUESTION + SUCCEDED:
      return state
        .setIn(['questions', 'isLoading'], false)
        .setIn(['questions', 'success'], 'Delete Question Success');
    case DELETE_QUESTION + FAILED:
      return state
        .setIn(['questions', 'isLoading'], false)
        .setIn(['questions', 'error'], `Delete Question FAILED: ${payload}`);

    case DELETE_ANSWER + REQUESTED:
      return state
        .setIn(['answers', 'isLoading'], true)
        .setIn(['answers', 'error'], '')
        .setIn(['answers', 'success'], '');
    case DELETE_ANSWER + SUCCEDED:
      return state
        .setIn(['answers', 'isLoading'], false)
        .setIn(['answers', 'success'], 'Delete Answer Success');
    case DELETE_ANSWER + FAILED:
      return state
        .setIn(['answers', 'isLoading'], false)
        .setIn(['answers', 'error'], `Delete Answer FAILED: ${payload}`);

    case DELETE_REPLY + REQUESTED:
      return state
        .setIn(['replies', 'isLoading'], true)
        .setIn(['replies', 'error'], '')
        .setIn(['replies', 'success'], '');
    case DELETE_REPLY + SUCCEDED:
      return state
        .setIn(['replies', 'isLoading'], false)
        .setIn(['replies', 'success'], 'Delete Reply Success');
    case DELETE_REPLY + FAILED:
      return state
        .setIn(['replies', 'isLoading'], false)
        .setIn(['replies', 'error'], `Delete Reply FAILED: ${payload}`);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------

const getQuestionId = state =>
  state.getIn(['question', 'question', 'data', '_id']);

// ------------------------------------
// Sagas
// ------------------------------------

function* CategoriesRequest() {
  try {
    yield put(startCategoriesRequest());
    const selection = '["name", "slug", "description", "bannerPhoto"]';
    const data = yield call(request, {
      url: `${API_URL}/knowledge-base/categories?select=${selection}`,
    });
    yield put(categoriesRequestSuccess(data));
  } catch (error) {
    yield put(categoriesRequestFailed(error));
  }
}

function* QuestionRequest({ payload: { slug } }) {
  try {
    let query = {
      slug,
    };
    query = encodeURI(query);
    const data = yield call(request, {
      url: `${API_URL}/knowledge-base/questions?query=${query}&populate=user,category,answers.user,answers.replies.user`,
    });
    yield put(questionsRequestSuccess(data));
  } catch (error) {
    yield put(questionsRequestFailed(error));
  }
}

function* SubmitAnswer({ payload }) {
  try {
    const token = yield select(getToken);
    const questionId = yield select(getQuestionId);
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/knowledge-base/questions/${questionId}/answers`,
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
    if (response.status === 200) {
      yield put(answerSubmitSuccess(response));
    } else {
      yield put(answerSubmitFailed(response.data));
    }
  } catch (error) {
    yield put(answerSubmitFailed(error));
  }
}

function* SubmitReply({ payload: data, meta: answerId }) {
  try {
    const token = yield select(getToken);
    const questionId = yield select(getQuestionId);
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/knowledge-base/questions/${questionId}/answers/${answerId}/reply`,
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
    if (response.status === 200) {
      yield put(replySubmitSuccess(response));
    } else {
      yield put(answerSubmitFailed(response.data));
    }
  } catch (error) {
    yield put(replySubmitFailed(error));
  }
}

function* UpVoteAnswer({ payload: answerIndex, meta: answerId }) {
  try {
    const token = yield select(getToken);
    const questionId = yield select(getQuestionId);
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/knowledge-base/questions/${questionId}/answers/${answerId}/upvote`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(upVoteAnswerSuccess(answerIndex, response.data));
    } else {
      yield put(upVoteAnswerFailed(response.data));
    }
  } catch (error) {
    yield put(upVoteAnswerFailed(error));
  }
}

function* DownVoteAnswer({ payload: answerIndex, meta: answerId }) {
  try {
    const token = yield select(getToken);
    const questionId = yield select(getQuestionId);
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/knowledge-base/questions/${questionId}/answers/${answerId}/downvote`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(downVoteAnswerSuccess(answerIndex, response.data));
    } else {
      yield put(downVoteAnswerFailed(response.data));
    }
  } catch (error) {
    yield put(downVoteAnswerFailed(error));
  }
}

function* MarkAnswerAsCorrect({ payload: answerId }) {
  try {
    const token = yield select(getToken);
    const questionId = yield select(getQuestionId);
    const data = {
      correctAnswer: answerId,
    };
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/knowledge-base/questions/${questionId}`,
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
    if (response.status === 200) {
      yield put(markAnswerAsCorrectSuccess(response.data));
    } else {
      yield put(markAnswerAsCorrectFailed(response.data));
    }
  } catch (error) {
    yield put(markAnswerAsCorrectFailed(error));
  }
}

function* DeleteQuestionRequest({ payload }) {
  const { questionId } = payload;
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/knowledge-base/questions/${questionId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(questionDeleteSuccess());
    } else if (response.status === 204) {
      yield put(questionDeleteSuccess());
    } else {
      yield put(questionDeleteError(response.data.message));
    }
  } catch (error) {
    yield put(questionDeleteError(error));
  }
}

function* DeleteAnswerRequest({ payload }) {
  const { questionId, answerId } = payload;
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/knowledge-base/questions/${questionId}/answers/${answerId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(answerDeleteSuccess());
    } else if (response.status === 204) {
      yield put(answerDeleteSuccess());
    } else {
      yield put(answerDeleteError(response.data.message));
    }
  } catch (error) {
    yield put(answerDeleteError(error));
  }
}

function* DeleteReplyRequest({ payload }) {
  const { questionId, answerId, replyId } = payload;
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/knowledge-base/questions/${questionId}/answers/${answerId}/replies/${replyId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(replyDeleteSuccess());
    } else if (response.status === 204) {
      yield put(replyDeleteSuccess());
    } else {
      yield put(replyDeleteError(response.data.message));
    }
  } catch (error) {
    yield put(replyDeleteError(error));
  }
}

export default function*(): Saga<void> {
  yield [
    takeLatest(GET_CATEGORIES + REQUESTED, CategoriesRequest),
    takeLatest(GET_QUESTION + REQUESTED, QuestionRequest),
    takeLatest(SUBMIT_ANSWER + REQUESTED, SubmitAnswer),
    takeLatest(UP_VOTE_ANSWER + REQUESTED, UpVoteAnswer),
    takeLatest(DOWN_VOTE_ANSWER + REQUESTED, DownVoteAnswer),
    takeLatest(MARK_ANSWER_AS_CORRECT + REQUESTED, MarkAnswerAsCorrect),
    takeLatest(SUBMIT_REPLY + REQUESTED, SubmitReply),
    takeLatest(DELETE_QUESTION + REQUESTED, DeleteQuestionRequest),
    takeLatest(DELETE_ANSWER + REQUESTED, DeleteAnswerRequest),
    takeLatest(DELETE_REPLY + REQUESTED, DeleteReplyRequest),
  ];
}
