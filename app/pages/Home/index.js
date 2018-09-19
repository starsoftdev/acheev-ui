// @flow

import React, { Component } from 'react';

import BannerFeatureList from 'components/Banner/FeatureList';
import BannerFeaturedPress from 'components/Banner/FeaturedPress';
import BannerNews from 'components/Banner/News';
import BottomBanner from 'components/Banner/Bottom';

class HomePage extends Component<{}> {
  render() {
    return (
      <div>
        <BannerFeatureList />
        <BannerNews />
        <BannerFeaturedPress />
        <BottomBanner />
      </div>
    );
  }
}

export default HomePage;
