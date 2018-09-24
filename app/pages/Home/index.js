// @flow

import React, { Component } from 'react';

import ExploreMarketplace from 'components/ExploreMarketplace';
import PopularCourseContainer from 'containers/PopularCourse';
import BrowseByTag from 'components/BrowseByTag';
import MobileAppBanner from 'components/Banner/MobileApp';

class HomePage extends Component<{}> {
  render() {
    return (
      <div>
        <ExploreMarketplace />
        <PopularCourseContainer />
        <BrowseByTag />
        <MobileAppBanner />
      </div>
    );
  }
}

export default HomePage;
