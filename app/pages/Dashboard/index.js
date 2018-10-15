// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Link from 'components/Link';
import UserInfoCard from 'components/UserInfoCard';
import BalanceStat from 'components/BalanceStat';
import OrderStatusCard from 'components/OrderStatusCard';

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
        <div className="row">
          <div className="column small-12 large-6">
            <div className="dashboard__box">
              <div className="row align-middle mb-lg">
                <div className="column">
                  <h1 className="fs-xl c-darkest-gray nm">My Orders</h1>
                </div>
                <div className="column shrink">
                  <Link className="dashboard__btnViewAll">View All</Link>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <OrderStatusCard className="mb-sm" />
                  <OrderStatusCard className="mb-sm" />
                  <OrderStatusCard className="mb-sm" />
                  <OrderStatusCard className="mb-sm" />
                  <OrderStatusCard className="mb-sm" />
                </div>
              </div>
            </div>
          </div>
          <div className="column small-12 large-6">
            <div className="dashboard__box">
              <div className="row align-middle">
                <div className="column">
                  <h1 className="fs-xl c-darkest-gray nm">My Jobs</h1>
                </div>
                <div className="column shrink">
                  <Link className="dashboard__btnViewAll">View All</Link>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <OrderStatusCard className="mb-sm" />
                  <OrderStatusCard className="mb-sm" />
                  <OrderStatusCard className="mb-sm" />
                  <OrderStatusCard className="mb-sm" />
                  <OrderStatusCard className="mb-sm" />
                </div>
              </div>
            </div>
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
