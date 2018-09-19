// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import RecentReviewList from 'components/RecentReviewList';

import { requestRecentReviews } from 'pages/Home/sagas';

type Props = {
  data: Object,
  requestRecentReviews: Function,
};

class RecentReviewContainer extends Component<Props> {
  componentWillMount() {
    this.props.requestRecentReviews();
  }
  render() {
    const { data } = this.props;
    return <RecentReviewList data={data} />;
  }
}

const mapStateToPtops = state => ({
  data: state.getIn(['home', 'recentReviews']),
});

const mapDispatchToProps = dispatch => ({
  requestRecentReviews: () => dispatch(requestRecentReviews()),
});

export default connect(mapStateToPtops, mapDispatchToProps)(
  RecentReviewContainer
);
