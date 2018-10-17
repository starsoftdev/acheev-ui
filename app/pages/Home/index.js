// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Banner from 'components/Banner/Home';
import ExploreMarketplace from 'components/ExploreMarketplace';
import PopularCourseContainer from 'containers/PopularCourse';
import BrowseByTag from 'components/BrowseByTag';
import MobileAppBanner from 'components/Banner/MobileApp';

import { openModal } from 'containers/App/sagas';

type Props = {
  user: Object,
  openModal: Function,
};

class HomePage extends Component<Props> {
  render() {
    const { user } = this.props;
    return (
      <div>
        {!user && <Banner openModal={this.props.openModal} />}
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

const mapDispatchToProps = dispatch => ({
  openModal: modal => dispatch(openModal(modal)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
