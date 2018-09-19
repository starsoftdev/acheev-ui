// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import moment from 'moment';

import TimeAgo from 'components/TimeAgo';
import Label from 'components/Label';

import './styles.scss';

type Props = {
  reply: Object,
  user: Object,
  questionId: string,
  answerId: string,
  deleteReply: Function,
};

class Reply extends Component<Props> {
  render() {
    const { reply, user, questionId, answerId } = this.props;
    const avatar = reply.getIn(['user', 'picture']);
    const username = reply.getIn(['user', 'username']);
    const userRole = reply.getIn(['user', 'role']);
    const userSlug = reply.getIn(['user', 'slug']);
    const userIdOfReply = reply.getIn(['user', '_id']);

    const currentUserId = user ? user.get('_id') : 0;
    const currentUserRole = user ? user.get('role') : '';
    const canRemoveItem =
      userIdOfReply === currentUserId || currentUserRole === 'admin';
    const replyId = reply.getIn(['_id']);

    const reputation = reply.getIn(['user', 'reputation']);
    let joined = reply.getIn(['user', 'joindate']);
    const createdOn = reply.get('createdOn');
    const message = reply.get('messageHtml');
    if (joined) {
      joined = moment(joined).format('YYYY-MM-DD');
    }
    return (
      <div className="reply">
        <div className="reply__border row nm">
          <div className="reply__user large-4 medium-12 row">
            <div className="column shrink">
              <Link to={`/members/${userSlug}`}>
                <img className="reply__avatar" src={avatar} alt={username} />
              </Link>
            </div>
            <div className="column">
              {userRole !== 'user' && (
                <div className="mb-sm">
                  <Label>{userRole}</Label>
                </div>
              )}
              <div className="reply__userName mb-mn">
                <Link to={`/members/${userSlug}`}>{username}</Link>
              </div>
              <div className="reply__userReputation ">
                Reputation {reputation}
              </div>
              <div className="reply__userJoined mb-mn">Joined {joined}</div>
              <TimeAgo className="reply__userTime" data={createdOn} />
            </div>
          </div>
          <div className="reply__message column large-8 medium-12">
            <div
              className="row"
              dangerouslySetInnerHTML={{ __html: message }}
            />
            {canRemoveItem && (
              <div className="row">
                <div className="column text-right">
                  <a
                    onClick={() => {
                      this.props.deleteReply(questionId, answerId, replyId);
                    }}
                    role="button"
                  >
                    DELETE
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Reply;
