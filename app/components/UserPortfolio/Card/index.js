// @flow

import React, { Component } from 'react';

import './styles.scss';

class PortfolioCard extends Component {
  render() {
    return (
      <div className="portfolioCard">
        <div className="portfolioCard__img mb-mn" />
        <h1 className="portfolioCard__title text-center">
          Playstation Logo Concept
        </h1>
      </div>
    );
  }
}

export default PortfolioCard;
