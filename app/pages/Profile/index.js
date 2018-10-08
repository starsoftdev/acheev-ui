// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import PageMenu from 'components/PageMenu';

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
    const menuItems = fromJS([
      {
        link: url,
        name: 'Profile',
      },
      {
        link: `${url}/billing`,
        name: 'Billing',
      },
      {
        link: `${url}/invite`,
        name: 'Invitations',
      },
      {
        link: `${url}/preferences`,
        name: 'Preferences',
      },
    ]);
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
        <div className="row">
          <div className="column small-12 large-8 large-offset-2">
            <div className="row align-middle">
              <div className="column small-12 large-5 hide-for-small-only">
                <h1 className="fs-xl c-darkest-gray nm">Profile Settings</h1>
              </div>
              <div className="column small-12 large-7">
                <PageMenu
                  data={menuItems}
                  location={location}
                  titlePath={['name']}
                  slugPath={['link']}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-xl show-for-small-only">
          <div className="column">
            <h1 className="fs-xl c-darkest-gray nm">Profile Settings</h1>
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
