// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import moment from 'moment';
import Link from 'components/Link';
import type { List, Map } from 'immutable';
import cx from 'classnames';

import TimeAgo from 'components/TimeAgo';
import Label from 'components/Label';
import ReplyForm from 'components/Forum/Answer/List/Reply/Form';
import Reply from 'components/Forum/Answer/List/Reply';
import RequireAuth from 'components/RequireAuth';
import Icon from 'components/Icon';
import IconCheckCircle from 'images/sprite/check-circle.svg';

import './styles.scss';

type Props = {
  answer: Map<string, *>,
  answerIndex: number,
  submitReply: Function,
  upVoteAnswer: Function,
  downVoteAnswer: Function,
  markAnswerAsCorrect: Function,
  requestQuestion: Function,
  isReplySubmitting: boolean,
  isMarkable: boolean,
  correctAnswer: string,
  deleteAnswer: Function,
  deleteReply: Function,
  questionId: string,
  user: Object,
  questionSlug: string,
};

class Answer extends Component<
  Props,
  {
    showReplyForm: boolean,
  }
> {
  constructor(props: Object) {
    super(props);
    this.state = {
      showReplyForm: false,
    };
  }
  renderReplies(replies: List<Map<string, string>>) {
    const { questionId, answer, user, deleteReply } = this.props;
    const answerId = answer.get('_id');
    return replies.map(reply => (
      <Reply
        key={generate()}
        reply={reply}
        user={user}
        questionId={questionId}
        answerId={answerId}
        deleteReply={deleteReply}
      />
    ));
  }
  render() {
    const {
      answer,
      answerIndex,
      submitReply,
      upVoteAnswer,
      downVoteAnswer,
      isReplySubmitting,
      correctAnswer,
      isMarkable,
      questionId,
      user,
      questionSlug,
    } = this.props;
    const { showReplyForm } = this.state;
    const answerId = answer.get('_id');
    const avatar = answer.getIn(['user', 'picture']);
    const username = answer.getIn(['user', 'username']);
    const userIdofAnswer = answer.getIn(['user', '_id']);
    const reputation = answer.getIn(['user', 'reputation']);
    let joined = answer.getIn(['user', 'joindate']);
    const userRole = answer.getIn(['user', 'role']);
    const userSlug = answer.getIn(['user', 'slug']);
    const createdOn = answer.get('createdOn');
    const message = answer.get('messageHtml');
    const upVotes = answer.get('upVotes').size;
    const downVotes = answer.get('downVotes').size;
    const replies = answer.get('replies');

    const isCorrectAnswer = correctAnswer === answerId;
    const className = cx('answer', { 'answer--correct': isCorrectAnswer });
    const currentUser = user;
    const currentUserId = currentUser ? currentUser.get('_id') : 0;
    const currentUserRole = currentUser ? currentUser.get('role') : '';
    const canRemoveItem =
      userIdofAnswer === currentUserId ||
      currentUserRole === 'admin' ||
      currentUserRole === 'ambassador';
    if (joined) {
      joined = moment(joined).format('MMM D, YYYY');
    }
    return (
      <div className={className}>
        <div className="row nm">
          <div className="answer__user medium-5 row small-12">
            <div className="column shrink">
              <Link to={`/members/${userSlug}`}>
                <img src={avatar} alt={username} className="answer__avatar" />
              </Link>
            </div>
            <div className="column">
              {userRole !== 'user' && (
                <div className="mb-sm">
                  <Label>{userRole}</Label>
                </div>
              )}
              <div className="answer__name mb-mn">
                <Link to={`/members/${userSlug}`}>{username}</Link>
              </div>
              <div className="answer__reputation ">
                {`Reputation ${String(reputation)}`}
              </div>
              <div className="answer__joined mb-mn">
                {`Joined ${String(joined)}`}
              </div>
              <TimeAgo className="answer__time" data={createdOn} />
            </div>
          </div>
          <div className="answer__message column medium-7 small-12">
            {isCorrectAnswer && (
              <div className="answer__correctAnswerMark row">
                <Icon
                  className="answer__correctAnswerIcon"
                  glyph={IconCheckCircle}
                  size={14}
                />
                This answer has been marked as correct
              </div>
            )}

            {isMarkable && (
              <div
                className="answer__correctAnswerButton row"
                onClick={() => {
                  this.props.markAnswerAsCorrect(answerId);
                }}
                role="button"
              >
                <Icon
                  className="answer__correctAnswerIcon"
                  glyph={IconCheckCircle}
                  size={14}
                />Mark This Answer As Correct
              </div>
            )}
            <div
              className="answer__text row"
              dangerouslySetInnerHTML={{ __html: message }}
            />
            <div className="mb-lg">
              <div className="answer__inquiry row">
                Was this answer helpful?
              </div>
              <div className="row">
                {currentUser ? (
                  <div
                    className="answer__vote column shrink npl"
                    onClick={() => upVoteAnswer(answerIndex, answerId)}
                    role="button"
                  >
                    Yes
                    <Label className="answer__voteLabel success ml-mn" hasArrow>
                      {upVotes}
                    </Label>
                  </div>
                ) : (
                  <RequireAuth toDo="vote answer">
                    <div className="answer__vote column shrink npl">
                      Yes
                      <Label
                        className="answer__voteLabel success ml-mn"
                        hasArrow
                      >
                        {upVotes}
                      </Label>
                    </div>
                  </RequireAuth>
                )}
                {currentUser ? (
                  <div
                    className="answer__vote column shrink"
                    onClick={() => downVoteAnswer(answerIndex, answerId)}
                    role="button"
                  >
                    No
                    <Label className="answer__voteLabel danger ml-mn" hasArrow>
                      {downVotes}
                    </Label>
                  </div>
                ) : (
                  <RequireAuth toDo="vote answer">
                    <div className="answer__vote column shrink">
                      No
                      <Label
                        className="answer__voteLabel danger ml-mn"
                        hasArrow
                      >
                        {downVotes}
                      </Label>
                    </div>
                  </RequireAuth>
                )}

                <div className="column text-right">
                  {currentUserId ? (
                    <a
                      onClick={() => {
                        this.setState({
                          showReplyForm: !this.state.showReplyForm,
                        });
                      }}
                      role="button"
                    >
                      Reply
                    </a>
                  ) : (
                    <RequireAuth toDo="reply comments">
                      <a>Reply</a>
                    </RequireAuth>
                  )}
                  {canRemoveItem && (
                    <span>
                      &nbsp;&nbsp;/&nbsp;&nbsp;
                      <a
                        onClick={() => {
                          this.props.deleteAnswer(questionId, answerId);
                        }}
                        role="button"
                      >
                        DELETE
                      </a>
                    </span>
                  )}
                </div>
              </div>
            </div>
            {showReplyForm && (
              <ReplyForm
                className="nm"
                answerId={answerId}
                isSubmiting={isReplySubmitting}
                error=""
                onSubmit={submitReply}
                questionSlug={questionSlug}
                requestQuestion={this.props.requestQuestion}
              />
            )}
          </div>
        </div>
        <div className="answer__replies">{this.renderReplies(replies)}</div>
      </div>
    );
  }
}

export default Answer;
