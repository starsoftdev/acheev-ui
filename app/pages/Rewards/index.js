// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import type { List, Map } from 'immutable';
import { replace } from 'react-router-redux';

import Button from 'components/Button';
import Icon from 'components/Icon';
import Breadcrumbs from 'components/Breadcrumbs';
import HighlightCards from 'components/HighlightCards';
import LogoList from 'components/LogoList';
import RegisterForm from 'containers/RegisterForm';
import Preloader from 'components/Preloader';
import Banner from 'components/PageBanner';

import { partnerLogosRequest } from 'containers/App/sagas';

import IconLogo from 'images/sprite/logo.svg';
import CardsImg from './signup.png';
import PhoneImg from './phone.png';
import LivByLiftImg from './liv.png';
import CardsIcon from './number-1-icon.jpg';
import PhoneIcon from './number-2-icon.jpg';
import LivByLiftIcon from './number-3-icon.jpg';

import './styles.scss';

const cards = fromJS([
  {
    src: CardsImg,
    icon: CardsIcon,
    title: 'Sign Up',
    desc:
      'Signing up takes a minute, and you’ll immediately be able to start earning Lift Points towards your personal cannabis rewards. Plus, just for signing up we’ll give you 50 points to get you started!',
  },
  {
    src: PhoneImg,
    icon: PhoneIcon,
    title: 'Collect Points',
    desc:
      'Earn Lift Points to unlock your Rewards by writing a product or strain review, completing one of our short surveys, or attending our events like the Lift Expo.',
  },
  {
    src: LivByLiftImg,
    icon: LivByLiftIcon,
    title: 'Unlock Rewards',
    desc:
      'Some of the rewards you can unlock by using Lift Points include discounts on medical cannabis*, credit towards accessories on our online store, industry event tickets and many more!',
  },
]);

type Props = {
  user: Object,
  isLoading: boolean,
  hideBreadcrumbs?: boolean,
  replace: Function,
  partnerLogos: Function,
  logos: List<Map<*, *>>,
};

class RewardsPage extends Component<Props> {
  constructor(props: Props) {
    super(props);
    const { user } = props;
    if (user && user.get('rewardsEnabled')) {
      props.replace('/me/rewards');
    }
  }

  componentWillMount() {
    const { user } = this.props;
    if (user && user.get('rewardsEnabled')) {
      this.props.replace('/me/rewards');
    }
  }
  componentDidMount() {
    this.props.partnerLogos();
  }
  render() {
    const { user, hideBreadcrumbs, isLoading } = this.props;
    const rewardsEnabled =
      user && (user.get('rewardsEnabled') || user.get('rewardsEnabledOn'));
    const medicalDisclaimer =
      '*Available to prescription-holding patients at participating licensed producers.';
    const rewardsExplainerTitle = 'Earn Lift Points. Unlock Cannabis Rewards.';
    const rewardsExplainerCopy =
      'Members earn Lift Points that can be redeemed for a variety of rewards, including discounts off medical cannabis* and high-quality accessories. By signing up, members also get free access to exclusive promotions from our partners and invite-only industry events.';
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Lift Rewards™',
      },
    ]);
    if (isLoading) {
      return <Preloader />;
    }

    const bannerBottomComponent = (
      <div>
        <h2 className="rewardsPage__logo">
          <Icon glyph={IconLogo} width={110} height={40} />
          &nbsp;&nbsp;REWARDS
        </h2>
        <h2 className="nm t-capitalize">{rewardsExplainerTitle}</h2>
      </div>
    );

    return (
      <div className="rewardsPage">
        {!hideBreadcrumbs && <Breadcrumbs path={breadcrumbPath} />}

        <Banner bottomComponent={bannerBottomComponent} expanded />
        <div className="row column text-center">
          <h5 className="mb-xl c-darkest-gray t-nt">
            <strong>{rewardsExplainerCopy}</strong>
          </h5>
          <HighlightCards cards={cards} borderedTitle />
          {!user && (
            <p className="mb-xl bb-light-gray pb-xl">{medicalDisclaimer}</p>
          )}
        </div>
        <div className="row column mb-hg">
          {!user && <RegisterForm showMessage={false} setUsernameWithEmail />}
        </div>
        {rewardsEnabled && (
          <div className="text-center">
            <h4 className="mb-xl">
              You have successfully registered for Lift Rewards.
            </h4>
            <div className="row small-9 medium-6 large-3 column">
              <div className="mb-md">
                <Button
                  className="button primary expanded"
                  element={Link}
                  to="/me/rewards"
                >
                  View My Rewards
                </Button>
              </div>
              <div className="mb-md">
                <Button
                  className="button secondary expanded"
                  element={Link}
                  to="/me"
                >
                  View My Profile
                </Button>
              </div>
            </div>
          </div>
        )}

        <LogoList logos={this.props.logos} title="Rewards Partners" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  logos: state.getIn(['app', 'partnerLogos']),
});

const mapDispatchToProps = dispatch => ({
  replace: path => dispatch(replace(path)),
  partnerLogos: () => dispatch(partnerLogosRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RewardsPage);
