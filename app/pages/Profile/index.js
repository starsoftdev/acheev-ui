// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import PageMenu from 'components/PageMenu';
import Banner from 'components/PageBanner';

import Routes from './routes';
import './styles.scss';

type Props = {
  breadcrumbPath: Object,
  location: Object,
  match: Object,
};

class Profile extends Component<Props> {
  render() {
    const {
      breadcrumbPath,
      location,
      match: { url },
    } = this.props;
    const menuItems = fromJS([
      {
        link: url,
        name: 'My Profile',
      },
      {
        link: `${url}/rewards`,
        name: 'My Rewards',
      },
      {
        link: `${url}/reviews`,
        name: 'My Reviews',
      },
      {
        link: `${url}/followings`,
        name: 'My Followings',
      },
    ]);
    return (
      <div className="profile">
        <Breadcrumbs path={breadcrumbPath} />
        <Banner title="My account" expanded />
        <PageMenu
          data={menuItems}
          location={location}
          titlePath={['name']}
          slugPath={['link']}
        />
        <Routes url={url} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  breadcrumbPath: state.getIn(['app', 'profileBreadcrumbPath']),
});

export default connect(
  mapStateToProps,
  null
)(Profile);
