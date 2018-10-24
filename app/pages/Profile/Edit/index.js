// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProfileEditForm from 'components/ProfileEditForm';

import {
  requestUserDataUpdate,
  requestUserPhotoUpload,
} from 'containers/App/sagas';

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  isUploading: boolean,
  saveUserData: Function,
  uploadPhoto: Function,
};

class EditProfile extends Component<Props> {
  render() {
    const {
      user,
      isLoading,
      error,
      saveUserData,
      uploadPhoto,
      isUploading,
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
            isUploading={isUploading}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  isUploading: state.getIn(['app', 'isUploading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  saveUserData: payload => dispatch(requestUserDataUpdate(payload)),
  uploadPhoto: payload => dispatch(requestUserPhotoUpload(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile);
