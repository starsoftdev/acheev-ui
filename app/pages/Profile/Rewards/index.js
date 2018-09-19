// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toastr } from 'react-redux-toastr';
import type { Map } from 'immutable';
import { fromJS } from 'immutable';
import cx from 'classnames';
import scrollToElement from 'scroll-to-element';
import Sticky from 'react-stickynode';
import { get, getIn } from 'utils/immutable';
import injectSagas from 'utils/injectSagas';

import CustomSelect from 'components/CustomSelect';
import EarnRewardsContainer from 'containers/EarnRewards';
import RewardsPage from 'pages/Rewards';
import Tooltip from 'components/Tooltip';
import RewardCard from 'components/RewardCard';
import PointsCard from 'components/PointsCard';
import Preloader from 'components/Preloader';

import { requestUser, setProfileBreadcrumbPath } from 'containers/App/sagas';
import saga, {
  reducer,
  requestRewards,
  requestRedemptions,
  unlockReward,
  redeemPromoCode,
} from './sagas';

import './styles.scss';

type Props = {
  requestRedemptions: Function,
  requestRewards: Function,
  unlockReward: Function,
  requestUser: Function,
  redeemPromoCode: Function,
  setProfileBreadcrumbPath: Function,
  redemptions: Object,
  rewards: Object,
  user: Map<*, *>,
  error: string,
  success: string,
  isLoading: boolean,
  promoError: string,
  promoSuccess: string,
  isPromoChecking: boolean,
};

type State = {
  businessList: Array<Object>,
  selectedBusiness: string,
  visibleRewards: string,
  unlockedReward: ?string,
};

class MyRewards extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      businessList: [
        {
          label: 'All',
          value: 'All',
        },
      ],
      selectedBusiness: 'All',
      visibleRewards: 'available',
      unlockedReward: null,
    };
  }
  componentWillMount() {
    const breadcrumbPath = fromJS([
      {
        link: '/me',
        title: 'My Account',
      },
      {
        link: '',
        title: 'My Rewards',
      },
    ]);
    this.props.setProfileBreadcrumbPath(breadcrumbPath);
  }
  componentDidMount() {
    this.props.requestRedemptions();
    this.props.requestRewards();
  }
  componentWillReceiveProps(newProps: Props) {
    const { error, success, user } = newProps;
    if (!user) return;

    if (error && error !== this.props.error) {
      toastr.error('', error);
    }

    if (success && success !== this.props.success) {
      toastr.success('', success);
    }

    let businessList = [];
    if (this.state.businessList.length === 1 && newProps.rewards.size > 0) {
      businessList = newProps.rewards
        .map(reward => reward.getIn(['business', 'name']))
        .toSet()
        .toList()
        .sort();
      businessList = businessList.insert(0, 'All');
      this.setState({
        businessList: businessList
          .map(item => ({
            label: item,
            value: item,
          }))
          .toJS(),
      });
    }
  }
  onChangeBusiness = (business: Object) => {
    this.setState({
      selectedBusiness: business.value,
    });
  };
  onCopy = code => {
    toastr.success('Success!', `Copied ${code} to clipboard`);
  };
  changeVisibleRewards = (visibleRewards: string) => {
    this.setState({ visibleRewards });
  };
  render() {
    const {
      user,
      redemptions,
      rewards,
      isLoading,
      promoError,
      promoSuccess,
      isPromoChecking,
    } = this.props;
    const userLiftPoints = getIn(user, ['pointWallet', 'balance'], '0');
    const unlockedRewardsTooltip = `These are your unlocked Rewards. Click Details for more
    information on Reward specifics, including how to redeem.`;
    const isRewardsUser = get(user, 'rewardsEnabled', false);
    const transactions = getIn(
      user,
      ['pointWallet', 'transactions'],
      fromJS([{}])
    );
    let filteredData = [];
    if (rewards.size > 0) {
      if (this.state.selectedBusiness === 'All') {
        filteredData = rewards;
      } else {
        filteredData = rewards.filter(
          item =>
            item.getIn(['business', 'name']) === this.state.selectedBusiness
        );
      }
    }
    return (
      <div className="rewardsDashboard">
        {!isRewardsUser && (
          <div className="row">
            <RewardsPage hideBreadcrumbs />
          </div>
        )}

        {isRewardsUser && (
          <div className="row align-stretch">
            <div className="rewardsDashboard__sidebar small-12 large-4 column">
              <div className="rewardsDashboard__sidebarInner">
                <Sticky bottomBoundary="#content">
                  <PointsCard
                    userLiftPoints={userLiftPoints}
                    transactions={transactions}
                  />
                  <div className="rewardsDashboard__tabs">
                    <div className="row">
                      <div className="small-4 large-12 column npr-medium-down">
                        <div
                          className={cx(
                            'rewardsDashboard__tab rewardsDashboard__tab--first',
                            {
                              'rewardsDashboard__tab--active':
                                this.state.visibleRewards === 'available',
                            }
                          )}
                          onClick={() => this.changeVisibleRewards('available')}
                          role="menuitem"
                        >
                          Available
                        </div>
                      </div>
                      <div className="small-4 large-12 column npr-medium-down">
                        <div
                          className={cx(
                            'rewardsDashboard__tab rewardsDashboard__tab--first',
                            {
                              'rewardsDashboard__tab--active':
                                this.state.visibleRewards === 'unlocked',
                            }
                          )}
                          onClick={() => this.changeVisibleRewards('unlocked')}
                          role="menuitem"
                        >
                          <div className="row align-middle">
                            <div className="column">Unlocked</div>
                            <div className="shrink column">
                              <Tooltip
                                tooltipPosition="top"
                                tooltipIndicator
                                tooltipContent={unlockedRewardsTooltip}
                              >
                                <span className="rewardsDashboard__tooltipPrompt">
                                  ?
                                </span>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="small-4 large-12 column npl-medium-down">
                        <div
                          className={cx(
                            'rewardsDashboard__tab rewardsDashboard__tab--other',
                            {
                              'rewardsDashboard__tab--active':
                                this.state.visibleRewards === 'earn',
                            }
                          )}
                          onClick={() => this.changeVisibleRewards('earn')}
                          role="menuitem"
                        >
                          Earn Points
                        </div>
                      </div>
                    </div>
                  </div>
                </Sticky>
              </div>
            </div>

            <div
              className="rewardsDashboard__content small-12 large-8 column"
              id="content"
            >
              <div className="row align-middle mb-md">
                <div className="column large-6 medium-12 small-12">
                  <h2 className="rewardsDashboard__title hide-for-small-only hide-for-medium-only">
                    {this.state.visibleRewards === 'earn'
                      ? 'Earn Lift Points'
                      : `${this.state.visibleRewards} Rewards`}
                  </h2>
                </div>
                {this.state.visibleRewards !== 'earn' && (
                  <div className="column small-12 medium-shrink">
                    <label htmlFor="business">Filter by business:</label>
                  </div>
                )}
                {this.state.visibleRewards !== 'earn' && (
                  <div className="column">
                    <CustomSelect
                      name="business"
                      className="large"
                      options={this.state.businessList}
                      value={this.state.selectedBusiness}
                      clearable={false}
                      onChange={this.onChangeBusiness}
                      sortAlphabetically={false}
                    />
                  </div>
                )}
              </div>
              {this.state.visibleRewards === 'available' && (
                <div>
                  {isLoading ? (
                    <Preloader height={222} />
                  ) : (
                    filteredData.map(item => {
                      const id = item.get('id');
                      return (
                        <RewardCard
                          key={id}
                          reward={item}
                          userPointsBalance={user.getIn([
                            'pointWallet',
                            'balance',
                          ])}
                          unlockReward={reward => {
                            this.setState({
                              unlockedReward: id,
                              visibleRewards: 'unlocked',
                            });
                            this.props.unlockReward(reward);
                            scrollToElement('#content');
                          }}
                        />
                      );
                    })
                  )}
                </div>
              )}
              {this.state.visibleRewards === 'unlocked' && (
                <div>
                  {!redemptions.size && (
                    <div>
                      You haven&#39;t unlocked anything recently. Unlock a
                      reward to get started.
                    </div>
                  )}
                  {redemptions.map(redemption => {
                    const reward = redemption.get('reward', {});
                    if (!reward) return null;
                    const code = redemption.get('code', '');
                    const id = reward.get('id');
                    const className = cx({
                      active: id === this.state.unlockedReward,
                    });
                    return (
                      <RewardCard
                        className={className}
                        key={id}
                        reward={reward}
                        code={code}
                        onCopy={this.onCopy}
                      />
                    );
                  })}
                </div>
              )}
              {this.state.visibleRewards === 'earn' && (
                <EarnRewardsContainer
                  redeemPromoCode={this.props.redeemPromoCode}
                  requestUser={this.props.requestUser}
                  error={promoError}
                  success={promoSuccess}
                  isLoading={isPromoChecking}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user'], {}),
  rewards: state.getIn(['myRewards', 'rewards', 'data'], []),
  redemptions: state.getIn(['myRewards', 'redemptions', 'data'], []),
  error: state.getIn(['myRewards', 'error'], ''),
  success: state.getIn(['myRewards', 'success'], ''),
  isLoading: state.getIn(['myRewards', 'isLoading']),
  promoError: state.getIn(['myRewards', 'promoError'], ''),
  promoSuccess: state.getIn(['myRewards', 'promoSuccess'], ''),
  isPromoChecking: state.getIn(['myRewards', 'isPromoChecking']),
});

const mapDispatchToProps = dispatch => ({
  requestRewards: () => dispatch(requestRewards()),
  requestRedemptions: () => dispatch(requestRedemptions()),
  unlockReward: payload => dispatch(unlockReward(payload)),
  requestUser: () => dispatch(requestUser()),
  redeemPromoCode: data => dispatch(redeemPromoCode(data)),
  setProfileBreadcrumbPath: path => dispatch(setProfileBreadcrumbPath(path)),
});

export default compose(
  injectSagas({ key: 'myRewards', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(MyRewards);
