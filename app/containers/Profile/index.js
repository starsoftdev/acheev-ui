// @flow
import React, { Component } from 'react';
import moment from 'moment';

import ProfileEditForm from 'components/ProfileEditForm';
import ProfileInfo from 'components/ProfileInfo';

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  saveUserData: Function,
  uploadPhoto: Function,
  uploadedPhoto: string,
};

class ProfileContainer extends Component<Props> {
  render() {
    const {
      user,
      isLoading,
      error,
      saveUserData,
      uploadPhoto,
      uploadedPhoto,
    } = this.props;
    return (
      <div className="row">
        <div className="small-12 columns">
          <ProfileEditForm
            user={user}
            isLoading={isLoading}
            error={error}
            saveUserData={saveUserData}
            uploadPhoto={uploadPhoto}
            uploadedPhoto={uploadedPhoto}
          />
        </div>
        {false && (
          <div className="small-12 medium-3 columns">
            <ProfileInfo
              reviewCount={user.get('reviewCount')}
              helpfulReviewCount={user.get('helpfulReviewCount')}
              reputation={user.get('reputation')}
              joindate={moment(user.get('joindate')).format('MMM D, YYYY')}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ProfileContainer;
