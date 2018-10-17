// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Banner from 'components/Banner/Home';
import ExploreMarketplace from 'components/ExploreMarketplace';
import PopularCourseContainer from 'containers/PopularCourse';
import BrowseByTag from 'components/BrowseByTag';
import MobileAppBanner from 'components/Banner/MobileApp';

type Props = {
  user: Object,
};

class HomePage extends Component<Props> {
  render() {
    const { user } = this.props;
    return (
      <div>
        {!user && <Banner />}
        <ExploreMarketplace />
        <PopularCourseContainer />
        <BrowseByTag />
        <MobileAppBanner />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

// const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  null
)(HomePage);
