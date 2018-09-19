// @flow

import * as React from 'react';
import type { Map } from 'immutable';
import { fromJS } from 'immutable';
import moment from 'moment';

import Label from 'components/Label';
import TimeAgo from 'components/TimeAgo';
import Icon from 'components/Icon';

import IconReview from 'images/sprite/review.svg';
import IconReputation from 'images/sprite/reputation.svg';
import IconReward from 'images/sprite/reward.svg';
import './styles.scss';

type Props = {
  data: Map<string, string>,
};

const MemberProfile = ({ data }: Props) => {
  const user = data.getIn(['hits', '0'], fromJS({}));
  const reviewCount = user.get('reviewCount');
  const helpfulReviewCount = user.get('helpfulReviewCount');
  const fullName = user.get('fullName');
  const fullLocation = user.get('fullLocation');
  let usingCannabisSince = user.get('usingCannabisSince');
  let joinDate = user.get('joindate');

  if (usingCannabisSince) {
    usingCannabisSince = moment(usingCannabisSince).format('YYYY');
  }
  if (joinDate) {
    joinDate = moment(joinDate).format('MMM D, YYYY');
  }
  const bio = user.get('bio');
  return (
    <div className="memberProfile row">
      <div className="small-12 medium-shrink column">
        <div
          className="memberProfile__avatar"
          style={{ backgroundImage: `url(${user.get('picture')}` }}
          title="User picture"
        />
      </div>
      <div className="memberProfile__details column">
        <Label className="success mb-mn">{user.get('role')}</Label>
        <div className="row align-bottom mb-lg">
          {fullName && (
            <div className="shrink column">
              <h4 className="nm">{fullName}</h4>
            </div>
          )}
          <div className="column">
            <TimeAgo data={user.get('lastonline')} title="Last online" />
          </div>
        </div>
        <div className="memberProfile__merit row">
          <div className="memberProfile__meritItem shrink column">
            <Icon className="mr-md" glyph={IconReputation} size={40} />
            <strong>{user.get('reputation')}</strong>&nbsp;reputation
          </div>

          <div className="memberProfile__meritItem shrink column">
            <Icon className="mr-md" glyph={IconReview} size={40} />
            <strong>{reviewCount}</strong>&nbsp;reviews
          </div>

          <div className="memberProfile__meritItem shrink column">
            <Icon className="mr-md" glyph={IconReward} size={40} />
            <strong>{helpfulReviewCount}</strong>&nbsp;helpful reviews
          </div>
        </div>
        <div className="memberProfile__personal">
          <div className="row">
            {fullLocation && (
              <div className="shrink column">
                From <strong>{fullLocation}</strong>
              </div>
            )}
            <div className="shrink column">
              Member since <strong>{joinDate}</strong>
            </div>
            {usingCannabisSince && (
              <div className="shrink column">
                using cannabis since <strong>{usingCannabisSince}</strong>
              </div>
            )}
          </div>
        </div>
        {bio && (
          <section>
            <h4 className="mb-xl">Bio</h4>
            <div>{bio}</div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;
