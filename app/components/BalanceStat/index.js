// @flow

import React, { Component } from 'react';

import './styles.scss';

class BalanceStat extends Component {
  render() {
    return (
      <div className="balanceStat">
        <h1 className="fs-xl c-darkest-gray mb-lg">Balance</h1>
        <div className="row text-center mb-xl">
          <div className="column small-12 large-4 balanceStat__box">
            <h1 className="balanceStat__price">
              $245
              <sub>,25</sub>
            </h1>
            <span className="balanceStat__status">Working</span>
          </div>
          <div className="column small-12 large-4 balanceStat__box">
            <h1 className="balanceStat__price">
              $3.176
              <sub>,83</sub>
            </h1>
            <span className="balanceStat__status">Available</span>
            <p>
              <span className="balanceStat__grayTxt">Earning + </span>
              <span className="c-secondary fs-md fw-bold">Top-Up</span>
            </p>
          </div>
          <div className="column small-12 large-4 balanceStat__box">
            <h1 className="balanceStat__price">
              $150
              <sub>,00</sub>
            </h1>
            <span className="balanceStat__status">Pending</span>
          </div>
        </div>
        <div className="row align-middle">
          <div className="column medium-shrink npr hide-for-small-only">
            <h1 className="c-darkest-gray fs-mx nm">Total Balance:&nbsp;</h1>
          </div>
          <div className="column npl hide-for-small-only">
            <h1 className="c-secondary fs-mx nm">
              $4.716
              <span className="balanceStat__decimalPoint">,83</span>
            </h1>
          </div>
          <div className="column small-12 show-for-small-only text-center mb-md">
            <h1 className="c-darkest-gray fs-mx nm">Total Balance:&nbsp;</h1>
            <h1 className="c-secondary fs-mx nm">
              $4.716
              <span className="balanceStat__decimalPoint">,83</span>
            </h1>
          </div>
          <div className="column small-12 medium-shrink">
            <div className="balanceStat__btnWithdraw">Withdraw Balance</div>
          </div>
        </div>
      </div>
    );
  }
}

export default BalanceStat;
