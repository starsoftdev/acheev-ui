// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { List } from 'immutable';

import TagList from 'components/TagList';
import TimeAgo from 'components/TimeAgo';
import Label from 'components/Label';

import './styles.scss';

type Props = {
  question: Object,
  category: Object,
  showDetail: boolean,
  currentUser: Object,
  deleteQuestion: Function,
  error: string,
  success: string,
  prefix?: string,
};

class QuestionInfo extends Component<Props> {
  componentWillReceiveProps(newProps: Props) {
    const { error, success } = newProps;
    if (error && error !== this.props.error) {
      toastr.error('', error);
    }

    if (success && success !== this.props.success) {
      toastr.success('', success);
    }
  }
  getLastAnsweredDate = (answers: List<*>, createdOn: string) => {
    let lastDate =
      answers.size > 0 ? answers.get(0).get('createdOn') : createdOn;
    answers.forEach(v => {
      const a = new Date(lastDate).getTime();
      const b = new Date(v.get('createdOn')).getTime();
      if (a < b) {
        lastDate = v.get('createdOn');
      }
      return true;
    });

    return lastDate;
  };
  renderDetails = (message: string, tags: Array<*>) => (
    <div>
      {message && (
        <div className="row mt-md">
          <div
            className="questionInfo__message column medium-9 small-12"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
      )}
      <div className="questionInfo__tags row mt-md column">
        <TagList value={tags} readOnly />
      </div>
    </div>
  );

  render() {
    const { question, category, showDetail, currentUser, prefix } = this.props;
    const questionId = question.get('_id');
    const avatar = question.getIn(['user', 'picture']);
    const userIdofQuestion = question.getIn(['user', '_id']);
    const username = question.getIn(['user', 'username']);
    const userSlug = question.getIn(['user', 'slug']);
    const closed = question.get('closed');
    const updatedOn = question.get('updatedOn');
    const title = question.get('title');
    const message = question.get('messageHtml');
    const views = question.get('views');
    const answers = question.get('answers');
    const answerCount = answers.size;
    let lastDate = this.getLastAnsweredDate(answers, updatedOn);
    const tags = question.get('tags');

    const currentUserId = currentUser ? currentUser.get('_id') : 0;
    const currentUserRole = currentUser ? currentUser.get('role') : '';
    const canRemoveItem =
      userIdofQuestion === currentUserId ||
      currentUserRole === 'admin' ||
      currentUserRole === 'ambassador';
    let timeAgoPrefix = prefix;
    if (!timeAgoPrefix) {
      timeAgoPrefix = answerCount > 0 ? 'answered' : 'asked';
    } else {
      lastDate = question.get('createdOn');
    }
    return (
      <div className="questionInfo">
        <div className="row">
          <div className="small-12 medium-shrink column mb-md">
            <Label
              className={classnames({
                danger: closed,
                success: !closed,
              })}
            >
              {closed ? 'Closed' : 'Open'}
            </Label>
          </div>
          <div className="column mb-sm">
            <div className="row align-middle">
              <div className="small-12 column mb-md">
                <Link
                  className="questionInfo__slugLink"
                  to={`/forum/${category.get('slug')}/${question.get('slug')}`}
                >
                  {title}
                </Link>
                {showDetail && this.renderDetails(message, tags)}
              </div>
              <div className="shrink column npr mb-sm">
                <Link to={`/members/${userSlug}`}>
                  <img
                    className="questionInfo__avatar"
                    src={avatar}
                    alt={username}
                  />
                </Link>
              </div>
              <div className="shrink column mb-sm">
                <Link to={`/members/${userSlug}`}>
                  <div className="questionInfo__user">{username}</div>
                </Link>
              </div>
              <div className="questionInfo__category shrink column mb-sm">
                in
                <Link
                  className="questionInfo__actionLink"
                  to={`/forum/${category.get('slug')}`}
                >
                  {category.get('name')}
                </Link>
              </div>
              <div className="shrink column mb-sm">
                <TimeAgo data={lastDate} prefix={timeAgoPrefix} />
              </div>
            </div>
          </div>
          <div className="small-12 medium-shrink column">
            <div className="row">
              <div className="shrink column fs-mn">
                <div className="fs-lg text-center">{answerCount || 0}</div>
                {answerCount === 1 ? 'Answer' : 'Answers'}
              </div>
              <div className="shrink column fs-mn">
                <div className="fs-lg text-center">{views}</div>
                Views
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          {canRemoveItem && (
            <span>
              <a
                onClick={() => {
                  this.props.deleteQuestion(questionId);
                }}
                role="button"
              >
                DELETE
              </a>
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default QuestionInfo;
