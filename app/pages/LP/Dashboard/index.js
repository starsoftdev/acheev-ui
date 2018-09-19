// @flow

import React, { Component } from 'react';
import moment from 'moment';

import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import type { Map } from 'immutable';
import type Moment from 'moment';

import PieChart from 'components/PieChart';
import LineChart from 'components/LineChart';
import Preloader from 'components/Preloader';
import DateRangePicker from 'components/DateRangePicker';
import Header from 'components/LP/TitleHeader';
import Select from 'components/CustomSelect';
import LimitedFeaturesMessage from 'components/LP/LimitedFeaturesMessage';

import { requestStats, requestRedemptions } from 'pages/LP/sagas';

import 'pages/LP/styles.scss';
import './styles.scss';

const intervalOptions: Array<string> = ['daily', 'weekly', 'monthly'];

type Props = {
  requestStats: Function,
  requestRedemptions: Function,
  stats: Map<*, *>,
  user: Map<*, *>,
  redemptions: Map<*, *>,
  redemptionsLoading: boolean,
  businessId: string,
  statsLoading: boolean,
};

type State = {
  from: Moment,
  to: Moment,
  interval: string,
};

class LpDashboardPage extends Component<Props, State> {
  state = {
    from: moment().subtract(7, 'd'),
    to: moment(),
    interval: 'daily',
  };

  componentDidMount() {
    const { businessId } = this.props;

    if (businessId) {
      this.requestData(businessId, this.state.from, this.state.to);
    }
  }

  componentWillReceiveProps(newProps: Props) {
    const { businessId } = newProps;

    if (businessId && !this.props.businessId) {
      this.requestData(businessId, this.state.from, this.state.to);
    }
  }

  requestData = (businessId, from, to) => {
    const formattedFrom = moment(from).format('YYYY-MM-DD');
    const formattedTo = moment(to).format('YYYY-MM-DD');
    if (!this.props.statsLoading) {
      this.props.requestStats(
        businessId,
        formattedFrom,
        formattedTo,
        this.state.interval
      );
    }
    this.props.requestRedemptions(businessId, formattedFrom, formattedTo);
  };

  requestStats = e => {
    const { businessId } = this.props;
    const { from, to } = this.state;
    this.setState({ interval: e.value });
    const formattedFrom = moment(from).format('YYYY-MM-DD');
    const formattedTo = moment(to).format('YYYY-MM-DD');
    this.props.requestStats(businessId, formattedFrom, formattedTo, e.value);
  };

  handleChange = (key, value) => {
    this.setState({ [key]: value }, () => {
      this.requestData(this.props.businessId, this.state.from, this.state.to);
    });
  };

  render() {
    const {
      stats,
      redemptions,
      redemptionsLoading,
      statsLoading,
      user,
    } = this.props;
    const statsData =
      stats &&
      stats.get('data') &&
      stats.getIn(['data', 'reviewsRatio'], fromJS([])).toJS();
    return (
      <React.Fragment>
        <LimitedFeaturesMessage role={user && user.get('role')} />
        <div className="lpDashboard">
          <Header title="Your Lift Rewards data at a glance">
            <DateRangePicker
              from={this.state.from}
              to={this.state.to}
              onChangeFrom={e => this.handleChange('from', e)}
              onChangeTo={e => this.handleChange('to', e)}
            />
          </Header>
          <div className="lp__panelSection">
            <div className="row">
              <div className="small-12 large-expand column mb-md">
                {redemptionsLoading ? (
                  <Preloader height={225} />
                ) : (
                  <div>
                    <div className="lp__label">Lift Rewards Redemptions</div>
                    <PieChart
                      data={redemptions.get('redemptions').toJS()}
                      label="redemptions"
                      labelPrefix={entry => `$${entry.price / 100}`}
                      stroke="#f7f8fb"
                      innerComponent={
                        <div className="text-center">
                          <div className="lpDashboard__value">
                            {redemptions.get('redeemedCount')}
                          </div>
                          <div className="lpDashboard__label mb-md">
                            Total Redemptions
                          </div>
                          <div className="lpDashboard__value">
                            ${redemptions.get('redeemedValue') / 100}
                          </div>
                          <div className="lpDashboard__label">Total Value</div>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
              {statsLoading ? (
                <Preloader height={400} />
              ) : (
                <div className="shrink column">
                  <div className="lp__label">Your business</div>
                  <div className="lpDashboard__panel">
                    <div className="lpDashboard__panelTitle">
                      Business Reviews
                    </div>
                    <div className="lpDashboard__panelLabel">
                      {stats.getIn(['data', 'businessReviewCount']) || 0}
                    </div>
                  </div>
                  <div className="lpDashboard__panel">
                    <div className="lpDashboard__panelTitle">
                      Business Rating
                    </div>
                    <div className="lpDashboard__panelLabel">
                      {stats.getIn(['data', 'businessRating']) || 0}
                    </div>
                  </div>
                </div>
              )}
              {statsLoading ? (
                <Preloader height={400} />
              ) : (
                <div className="shrink column">
                  <div className="lp__label">Your products</div>
                  <div className="lpDashboard__panel lpDashboard__panel--secondary">
                    <div className="lpDashboard__panelTitle">
                      Product Reviews
                    </div>
                    <div className="lpDashboard__panelLabel">
                      {stats.getIn(['data', 'productReviewCount']) || 0}
                    </div>
                  </div>
                  <div className="lpDashboard__panel lpDashboard__panel--secondary">
                    <div className="lpDashboard__panelTitle">
                      Average Product Rating
                    </div>
                    <div className="lpDashboard__panelLabel">
                      {stats.getIn(['data', 'productRating']) || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row align-middle">
            <div className="small-12 medium-expand column mb-md">
              <h4 className="lpDashboard__lineChartTitle nm">
                Your reviews proportional to all reviews on Lift
              </h4>
            </div>
            <div className="lpDashboard__lineChartSelect shrink column mb-md">
              <Select
                value={this.state.interval}
                options={intervalOptions}
                onChange={this.requestStats}
                clearable={false}
                sortAlphabetically={false}
              />
            </div>
          </div>
          <div className="row column">
            {statsLoading ? (
              <div className="text-center">
                <Preloader height={400} />
              </div>
            ) : (
              <LineChart data={statsData} />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'lpUser']),
  businessId: state.getIn(['lp', 'businesses', 'data', 0, 'id']),
  statsLoading: state.getIn(['lp', 'stats', 'isLoading']),
  stats: state.getIn(['lp', 'stats']),
  redemptions: state.getIn(['lp', 'redemptions', 'data']),
  redemptionsLoading: state.getIn(['lp', 'redemptions', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestStats: (businessId, from, to, interval) =>
    dispatch(requestStats(businessId, from, to, interval)),
  requestRedemptions: (businessId, from, to) =>
    dispatch(requestRedemptions(businessId, from, to)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LpDashboardPage);
