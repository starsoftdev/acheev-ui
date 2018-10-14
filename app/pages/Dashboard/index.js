// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserInfoCard from 'components/UserInfoCard';
import BalanceStat from 'components/BalanceStat';

import './styles.scss';

type Props = {
  currentUser: Object,
};

class Dashboard extends Component<Props> {
  render() {
    const { currentUser } = this.props;
    return (
      <div className="dashboard">
        <div className="row">
          <div className="column small-12 large-4">
            <div className="row column mb-lg">
              <UserInfoCard user={currentUser} />
            </div>
          </div>
          <div className="column small-12 large-8">
            <BalanceStat />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
});

export default connect(
  mapStateToProps,
  null
)(Dashboard);
