// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import RecentVideos from 'components/RecentVideos';

type Props = {
  data: Object,
};

class RecentVideosContainer extends Component<Props> {
  render() {
    const { data } = this.props;
    return <RecentVideos data={data} />;
  }
}

const mapStateToPtops = state => ({
  data: state.getIn(['home', 'recentVideos']),
});

export default connect(mapStateToPtops)(RecentVideosContainer);
