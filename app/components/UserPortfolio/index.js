// @flow

import React, { Component } from 'react';

import PortfolioCard from './Card';

import './styles.scss';

class UserPortfolio extends Component {
  render() {
    return (
      <div className="userPortfolio">
        <div className="row">
          <div className="column">
            <h1 className="userPortfolio__title mb-lg">
              DigitalPartners Portfolio
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <PortfolioCard />
          </div>
          <div className="column large-3">
            <PortfolioCard />
          </div>
          <div className="column large-3">
            <PortfolioCard />
          </div>
          <div className="column large-3">
            <div className="userPortfolio__seeMore">
              <div className="text-center">
                <p>+</p>
                <p>See more</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserPortfolio;
