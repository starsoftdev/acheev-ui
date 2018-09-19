// @flow

import React, { Component } from 'react';

import FeatureList from 'components/FeatureList';

import './styles.scss';

class GetPointsSuccessPage extends Component<{}> {
  render() {
    return (
      <div className="getPointsSuccessPage">
        <div className="row column text-center mb-lg">
          <div className="getPointsSuccessPage__pointsCard">
            <h6 className="getPointsSuccessPage__pointsCardSubtitle nm">
              You&rsquo;re eligible for
            </h6>
            <h1 className="getPointsSuccessPage__pointsCardTitle mb-tn">200</h1>
            <h6 className="getPointsSuccessPage__pointsCardSubtitle">
              lift points
            </h6>
          </div>
        </div>
        <div className="row column text-center mb-xl">
          <h2 className="getPointsSuccessPage__title">Congratulations!</h2>
          <h5 className="c-secondary t-nt">
            <strong>
              200 Lift Points will be deposited into your Lift Rewards account.
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

export default GetPointsSuccessPage;
