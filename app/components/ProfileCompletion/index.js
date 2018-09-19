// @flow

import * as React from 'react';
import Link from 'components/Link';

import ProfileCompletionItem from 'components/ProfileCompletionItem';
import CircleProgressBar from 'components/CircleProgressBar';

import IconStar from 'images/sprite/star-white.svg';
import IconPlus from 'images/sprite/plus-white.svg';
import IconHeart from 'images/sprite/heart-white.svg';
import IconBio from 'images/sprite/bio.svg';
import IconCamera from 'images/sprite/photo-camera.svg';

import './styles.scss';

type Props = {
  user: Object,
};

const ProfileCompletion = ({ user }: Props) => {
  const options = {
    strokeWidth: 5,
    color: '#FFFFFF',
    trailColor: '#3eb5be',
    trailWidth: 4.5,
  };
  let completed = 0;
  const userUploadedPhoto = user.get('picture').includes('lift.co/uploads');
  if (user.get(['achievements', 'reviewedBusiness'])) completed += 1;
  if (user.get(['achievements', 'followedBusiness'])) completed += 1;
  if (user.get(['achievements', 'likedBusiness'])) completed += 1;
  if (user.get('bio')) completed += 1;
  if (userUploadedPhoto) completed += 1;
  return (
    <div className="profileCompletion">
      <div className="profileCompletion__header">Profile Completion</div>
      <div className="profileCompletion__progress">
        <CircleProgressBar
          progress={completed / 5}
          text={`${completed} of 5`}
          options={options}
          initialAnimate={false}
          radius={75}
        />
      </div>
      <div className="profileCompletion__info">
        <h4 className="profileCompletion__description">
          Just getting started? Complete your public profile and receive 50
          points for the <Link to="/me/rewards">Lift Shop</Link>.
        </h4>
        <ProfileCompletionItem
          className="mb-mn"
          title="Review a strain"
          completed={user.get(['achievements', 'reviewedBusiness'])}
          glyph={IconStar}
        />
        <ProfileCompletionItem
          className="mb-mn"
          title="Follow a strain"
          completed={user.get(['achievements', 'followedBusiness'])}
          glyph={IconPlus}
        />
        <ProfileCompletionItem
          className="mb-mn"
          title="Like a strain"
          completed={user.get(['achievements', 'likedBusiness'])}
          glyph={IconHeart}
        />
        <ProfileCompletionItem
          className="mb-mn"
          title="Add a bio"
          completed={!!user.get('bio')}
          glyph={IconBio}
        />
        <ProfileCompletionItem
          className="mb-mn"
          title="Add a profile picture"
          completed={!!userUploadedPhoto}
          glyph={IconCamera}
        />
      </div>
    </div>
  );
};

export default ProfileCompletion;
