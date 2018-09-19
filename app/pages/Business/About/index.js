// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { List } from 'immutable';
import { matchPath } from 'react-router';

import BusinessProfileContainer from 'containers/BusinessProfile';

import injectSagas from 'utils/injectSagas';

import saga, {
  reducer,
  requestBusinessProfile,
  followLikeBusiness,
  requestBusinessFollows,
  requestBusinessLikes,
} from 'containers/BusinessProfile/sagas';

import { setMetaJson } from 'containers/App/sagas';

import Routes from './routes';

type Props = {
  match: Object,
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
  requestBusinessFollows: Function,
  requestBusinessLikes: Function,
  setMetaJson: Function,
  location: Object,
};

class BusinessPage extends Component<Props> {
  render() {
    const {
      match,
      location,
      business,
      isLoading,
      error,
      businessFollowLike,
      follows,
      likes,
      breadcrumbPath,
      currentUser,
    } = this.props;
    const {
      params: { category },
    } = matchPath(match.url, {
      path: '/:category',
    });
    return (
      <div>
        <BusinessProfileContainer
          category={category}
          slug={match.params.slug}
          location={location}
          business={business}
          isLoading={isLoading}
          error={error}
          businessFollowLike={businessFollowLike}
          follows={follows}
          likes={likes}
          breadcrumbPath={breadcrumbPath}
          currentUser={currentUser}
          requestBusinessProfile={this.props.requestBusinessProfile}
          followLikeBusiness={this.props.followLikeBusiness}
          requestBusinessFollows={this.props.requestBusinessFollows}
          requestBusinessLikes={this.props.requestBusinessLikes}
          setMetaJson={this.props.setMetaJson}
        />
        <Routes category={category} match={match} />
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

export default compose(
  injectSagas({ key: 'profile', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BusinessPage);
