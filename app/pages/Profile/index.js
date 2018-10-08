// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Routes from './routes';
import './styles.scss';

type Props = {
  user: Object,
  match: Object,
};

class Profile extends Component<Props> {
  render() {
    const {
      user,
      match: { url },
    } = this.props;
    const username =
      user.get('first_name') && user.get('last_name')
        ? `${user.get('first_name')} ${user.get('last_name')}`
        : user.get('username');
    const userImg = user.get('image') ? user.getIn(['image', 'src']) : '';
    return (
      <div className="profile">
        <div className="profile__banner">
          <div className="row align-center">
            <div className="column shrink">
              <div
                className="profile__bannerImg mb-md"
                style={{ backgroundImage: `url(${userImg})` }}
              />
              <h1 className="profile__bannerUsername">{username}</h1>
            </div>
          </div>
        </div>
        <Routes url={url} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

export default connect(
  mapStateToProps,
  null
)(Profile);
