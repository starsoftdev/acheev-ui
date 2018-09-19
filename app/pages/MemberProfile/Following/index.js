// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';

import { requestFollowings } from 'pages/MemberProfile/sagas';
import Preloader from 'components/Preloader';
import ProductsList from 'components/ProductsList';
import Pagination from 'components/Pagination';

import './styles.scss';

type Props = {
  isLoading: boolean,
  followings: Map<string, any>,
  pages: number,
  profile: Map<string, string>,
  requestFollowings: Function,
};

class MemberProfileFollowingPage extends Component<Props> {
  componentWillReceiveProps({ profile, followings }) {
    if (profile && followings === null) {
      this.props.requestFollowings(profile.getIn(['hits', 0, '_id']));
    }
  }
  render() {
    const { followings, profile, isLoading, pages } = this.props;
    return (
      <div>
        {isLoading ? (
          <Preloader height={348} />
        ) : (
          <div className="memberProfileFollowing">
            {followings && followings.get('hits').size > 0 ? (
              <ProductsList data={followings.get('hits')} />
            ) : (
              <div className="row column text-center c-secondary">
                <h2 className="mb-xl">This user does not follow anything.</h2>
              </div>
            )}
          </div>
        )}
        <Pagination
          pageCount={Math.ceil(pages)}
          onPageChange={e =>
            this.props.requestFollowings(
              profile.getIn(['hits', 0, '_id']),
              ['model', 'page'],
              e
            )}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['memberProfile', 'followings', 'isLoading']),
  followings: state.getIn(['memberProfile', 'followings', 'data']),
  pages: state.getIn(['memberProfile', 'followings', 'data', 'pages']),
  profile: state.getIn(['memberProfile', 'profile', 'data']),
});

const mapDispatchToProps = dispatch => ({
  requestFollowings: (userId, path, value) =>
    dispatch(requestFollowings(userId, path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  MemberProfileFollowingPage
);
