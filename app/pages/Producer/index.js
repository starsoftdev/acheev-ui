// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import BusinessProfileContainer from 'containers/BusinessProfile';

import {
  requestBusinessProfile,
  followLikeBusiness,
  requestBusinessFollows,
  requestBusinessLikes,
} from 'containers/BusinessProfile/sagas';

import { setMetaJson } from 'containers/App/sagas';

type Props = {
  params: Object,
  location: Object,
  isLoading: boolean,
  error: string,
  business: Object,
  businessFollowLike: Object,
  requestBusinessProfile: Function,
  followLikeBusiness: Function,
  currentUser: Object,
  follows: Object,
  likes: Object,
  breadcrumbPath: List<Map<string, Object>>,
  helmetTitle: string,
  requestBusinessFollows: Function,
  requestBusinessLikes: Function,
  setMetaJson: Function,
  location: Object,
  children: React.Element<any>,
};

class ProducerPage extends Component<Props> {
  render() {
    const {
      params,
      location,
      business,
      isLoading,
      error,
      businessFollowLike,
      follows,
      likes,
      breadcrumbPath,
      helmetTitle,
      currentUser,
    } = this.props;
    return (
      <div>
        <BusinessProfileContainer
          category="producer"
          slug={params.slug}
          location={location}
          business={business}
          isLoading={isLoading}
          error={error}
          businessFollowLike={businessFollowLike}
          follows={follows}
          likes={likes}
          breadcrumbPath={breadcrumbPath}
          helmetTitle={helmetTitle}
          currentUser={currentUser}
          requestBusinessProfile={this.props.requestBusinessProfile}
          followLikeBusiness={this.props.followLikeBusiness}
          requestBusinessFollows={this.props.requestBusinessFollows}
          requestBusinessLikes={this.props.requestBusinessLikes}
          setMetaJson={this.props.setMetaJson}
        />
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  business: state.getIn(['profile', 'business', 'data']),
  isLoading: state.getIn(['profile', 'business', 'isLoading']),
  error: state.getIn(['profile', 'business', 'error']),
  breadcrumbPath: state.getIn(['profile', 'breadcrumbPath']),
  helmetTitle: state.getIn(['profile', 'helmetTitle']),
  businessFollowLike: state.getIn(['profile', 'businessFollowLike']),
  follows: state.getIn(['profile', 'follows']),
  likes: state.getIn(['profile', 'likes']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinessProfile: (slug, value) =>
    dispatch(requestBusinessProfile(slug, value)),
  followLikeBusiness: (businessId, actionType) =>
    dispatch(followLikeBusiness(businessId, actionType)),
  requestBusinessFollows: businessId =>
    dispatch(requestBusinessFollows(businessId)),
  requestBusinessLikes: businessId =>
    dispatch(requestBusinessLikes(businessId)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProducerPage);
