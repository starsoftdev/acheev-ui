// @flow

import React, { Component } from 'react';

import FeatureList from 'components/FeatureList';

import PatientGuideImg from '../patient-guide.png';

import './styles.scss';

class GetGuideSuccessPage extends Component<{}> {
  render() {
    return (
      <div className="getGuideSuccessPage">
        <div className="row column text-center mb-lg">
          <img
            className="getGuideSuccessPage__image"
            alt="patient guide"
            src={PatientGuideImg}
            role="banner"
          />
        </div>
        <div className="row column text-center mb-xl">
          <h2 className="getGuideSuccessPage__title">Congratulations!</h2>
          <h5 className="c-secondary t-nt">
            <strong>
              Patient Guide is on its way—check your email inbox for a download
              link.
            </strong>
          </h5>
        </div>
        <div className="row column">
          <div className="bb-light-gray mb-xl" />
        </div>
        <FeatureList />
      </div>
    );
  }
}

export default GetGuideSuccessPage;
