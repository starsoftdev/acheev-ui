// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import CustomSelect from 'components/CustomSelect';
import RegisterForm from 'containers/RegisterForm';
import Button from 'components/Button';
import PageBanner from 'components/PageBanner';

import { requestUserDataUpdate, trackCampaign } from 'containers/App/sagas';

import { MAGAZINE_REFERRER_OPTIONS } from 'enum/constants';

import PatientGuideBanner from 'images/banners/patient-guide.jpg';
import PatientGuideImg from './patient-guide.png';

import './styles.scss';

type Props = {
  user: Object,
  isLoading: boolean,
  saveUserData: Function,
  replace: Function,
  trackCampaign: Function,
};

class GetGuide extends Component<
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
      this.props.replace('/getguide/success');
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
      this.props.replace('/getguide/success');
    }
  }
  render() {
    const { user, isLoading } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Get Guide',
      },
    ]);
    return (
      <div className="getGuide">
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={PatientGuideBanner}
          title="Patient Guide"
          titleLarge
          expanded
          subtitle="Everything you need to know to obtain and use a medical cannabis prescription."
        />
        <div className="row mb-lg">
          <div className="column small-12 medium-4 text-center">
            <img
              className="getGuide__image"
              alt=""
              src={PatientGuideImg}
              role="banner"
            />
          </div>
          <div className="column small-12 medium-8">
            <div>
              <h2 className="c-secondary mb-md small-only-text-center">
                Curious about medical cannabis?
              </h2>
              <p className="nm small-only-text-center">
                Lift’s Cannabis 101 Patient Guide has everything you need,
                including information to help you determine if cannabis is right
                for you, advice on talking to your doctor, and education on how
                to use, store and talk about your cannabis prescription.
                Complete the form below and we’ll send you a download link right
                away - it’s that easy!
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
              redirectTo="/getguide"
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

export default connect(mapStateToProps, mapDispatchToProps)(GetGuide);
