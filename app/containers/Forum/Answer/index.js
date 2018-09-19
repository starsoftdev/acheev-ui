// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';

import Answer from 'components/Forum/Answer/List/Answer';

import {
  requestQuestion,
  submitReply,
  upVoteAnswer,
  downVoteAnswer,
  markAnswerAsCorrect,
  deleteAnswer,
  deleteReply,
} from 'pages/Forum/Question/sagas';

type Props = {
  answer: Map<string, string>,
  answerIndex: number,
  submitReply: Function,
  upVoteAnswer: Function,
  downVoteAnswer: Function,
  markAnswerAsCorrect: Function,
  requestQuestion: Function,
  isReplySubmitting: boolean,
  isMarkingAnswerAsCorrect: boolean,
  correctAnswer: string,
  isMarkable: boolean,
  questionId: string,
  questionSlug: string,
  user: Object,
  deleteAnswer: Function,
  deleteReply: Function,
};

class AnswerContainer extends Component<
  Props,
  {
    showReplyForm: boolean,
  }
> {
  render() {
    const {
      answer,
      answerIndex,
      isReplySubmitting,
      isMarkingAnswerAsCorrect,
      correctAnswer,
      isMarkable,
      questionId,
      user,
      questionSlug,
    } = this.props;
    return (
      <Answer
        answer={answer}
        answerIndex={answerIndex}
        submitReply={this.props.submitReply}
        upVoteAnswer={this.props.upVoteAnswer}
        downVoteAnswer={this.props.downVoteAnswer}
        markAnswerAsCorrect={this.props.markAnswerAsCorrect}
        requestQuestion={this.props.requestQuestion}
        isReplySubmitting={isReplySubmitting}
        isMarkingAnswerAsCorrect={isMarkingAnswerAsCorrect}
        correctAnswer={correctAnswer}
        isMarkable={isMarkable}
        deleteAnswer={this.props.deleteAnswer}
        deleteReply={this.props.deleteReply}
        questionId={questionId}
        questionSlug={questionSlug}
        user={user}
      />
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isReplySubmitting: state.getIn(['question', 'replyForm', 'isLoading']),
  isMarkingAnswerAsCorrect: state.getIn(['question', 'question', 'isUpdating']),
});

const mapDispatchToProps = dispatch => ({
  requestQuestion: slug => dispatch(requestQuestion(slug)),
  submitReply: (payload, answerId) => dispatch(submitReply(payload, answerId)),
  upVoteAnswer: (answerIndex, answerId) =>
    dispatch(upVoteAnswer(answerIndex, answerId)),
  downVoteAnswer: (answerIndex, answerId) =>
    dispatch(downVoteAnswer(answerIndex, answerId)),
  markAnswerAsCorrect: answerId => dispatch(markAnswerAsCorrect(answerId)),
  deleteAnswer: (questionId, answerId) =>
    dispatch(deleteAnswer(questionId, answerId)),
  deleteReply: (questionId, answerId, replyId) =>
    dispatch(deleteReply(questionId, answerId, replyId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnswerContainer);
