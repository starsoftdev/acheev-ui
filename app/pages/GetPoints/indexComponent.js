// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import CustomSelect from 'components/CustomSelect';
import RegisterForm from 'containers/RegisterForm';
import Button from 'components/Button';

import { requestUserDataUpdate, trackCampaign } from 'containers/App/sagas';

import { MAGAZINE_REFERRER_OPTIONS } from 'enum/constants';

import RewardsLogo from './rewards-logo.png';
import RewardsImg from './rewards.png';

import './styles.scss';

type Props = {
  user: Object,
  isLoading: boolean,
  saveUserData: Function,
  replace: Function,
  trackCampaign: Function,
};

class GetPoints extends Component<
  Props,
  {
    liftMagazineReferrer: string,
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      liftMagazineReferrer: MAGAZINE_REFERRER_OPTIONS[0].value,
    };
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.user && newProps.user.get('liftMagazineReferrer')) {
      this.props.replace('/getpoints/success');
    }

    if (
      this.props.user &&
      newProps.user &&
      this.props.user.get('updatedOn') !== newProps.user.get('updatedOn')
    ) {
      this.props.trackCampaign(
        'Lift Magazine',
        this.state.liftMagazineReferrer
      );
    }
  }
  render() {
    const { user, isLoading } = this.props;
    const rewardsExplainerTitle = 'Earn Lift Points. Unlock Cannabis Rewards.';
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Get Points',
      },
    ]);
    return (
      <div className="getPoints">
        <Breadcrumbs path={breadcrumbPath} />
        <div className="getPoints__banner">
          <img className="mb-sm" src={RewardsLogo} alt="rewards logo" />
          <h2 className="c-white nm t-capitalize">{rewardsExplainerTitle}</h2>
        </div>
        <div className="row mb-lg">
          <div className="column small-12 medium-4 text-center">
            <img
              className="getPoints__image"
              alt=""
              src={RewardsImg}
              role="banner"
            />
          </div>
          <div className="column small-12 medium-8">
            <div>
              <h2 className="c-secondary mb-md small-only-text-center">
                Earn discounts at licensed producers with Canada&apos;s only
                cannabis loyalty program.
              </h2>
              <p className="nm small-only-text-center">
                Complete the form below to log in or sign up for Lift Rewards,
                and receive 200 points towards prescription cannabis and
                accessories.
              </p>
            </div>
          </div>
        </div>
        <div className="row column">
          <div className="bb-light-gray mb-xl" />
        </div>
        <div className="row column mb-hg">
          {!user && (
            <RegisterForm
              showMessage={false}
              setUsernameWithEmail
              showMagazineReferrer
              redirectTo="/getpoints"
            />
          )}
          {user && (
            <div>
              <div className="row centered mb-lg">
                <div className="small-12 medium-8 medium-offset-2 column center">
                  <div className="register__formField">
                    <label htmlFor="gender">
                      How did you receive your copy of lift magazine?
                    </label>
                    <CustomSelect
                      className="large"
                      value={this.state.liftMagazineReferrer}
                      clearable={false}
                      options={MAGAZINE_REFERRER_OPTIONS}
                      onChange={e => {
                        this.setState({
                          liftMagazineReferrer: e.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row column text-center">
                <Button
                  className="button secondary spacious"
                  isLoading={isLoading}
                  onClick={() => {
                    this.props.saveUserData(this.state);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  saveUserData: payload => dispatch(requestUserDataUpdate(payload)),
  replace: path => dispatch(replace(path)),
  trackCampaign: (compaignName, compaignReferrer) =>
    dispatch(trackCampaign(compaignName, compaignReferrer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GetPoints);
