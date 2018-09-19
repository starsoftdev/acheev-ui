// @flow

import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { compose } from 'redux';

import injectSagas from 'utils/injectSagas';

import Breadcrumbs from 'components/Breadcrumbs';
import PageBanner from 'components/PageBanner';
import PatientGuideForm from 'components/PatientGuideForm';

import PatientGuideBanner from 'images/banners/patient-guide.jpg';

import saga, { reducer, requestPatientGuide } from './sagas';
import PatientGuideImg from './patient-guide.jpg';
import './styles.scss';

type Props = {
  requestPatientGuide: Function,
  isLoading: boolean,
  error: string,
  success: string,
  currentUser: Object,
};

class PatientGuide extends Component<Props> {
  render() {
    const { isLoading, error, success, currentUser } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Patient Guide - Lift & Co.',
      },
    ]);
    return (
      <div className="patientGuide mb-md">
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={PatientGuideBanner}
          title="Patient Guide"
          titleLarge
          expanded
          subtitle="Everything you need to know to obtain and use a medical cannabis prescription."
        />
        <div className="row">
          <div className="column small-12 medium-shrink text-center">
            <img
              className="patientGuide__image"
              alt=""
              src={PatientGuideImg}
              role="banner"
            />
          </div>
          <div className="column small-12 medium-expand">
            <div className="patientGuide__titleSection mb-md">
              <h2 className="c-darkest-gray">
                Curious about medical cannabis?
              </h2>
              <p className="mb-md">
                Lift’s Cannabis 101 Patient Guide has everything you need,
                including information to help you determine if cannabis is right
                for you, advice on talking to your doctor, and education on how
                to use, store and talk about your cannabis prescription.
                Complete the form below and we’ll send you a download link right
                away - it’s that easy!
              </p>
            </div>
            <PatientGuideForm
              submitForm={this.props.requestPatientGuide}
              isLoading={isLoading}
              error={error}
              success={success}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  products: state.getIn(['createReview', 'data', 'hits']),
  isLoading: state.getIn(['patientGuide', 'isLoading']),
  error: state.getIn(['patientGuide', 'error']),
  success: state.getIn(['patientGuide', 'success']),
});

const mapDispatchToProps = dispatch => ({
  requestPatientGuide: payload => dispatch(requestPatientGuide(payload)),
});

export default compose(
  injectSagas({ key: 'patientGuide', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(PatientGuide);
