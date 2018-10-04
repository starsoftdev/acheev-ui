// @flow

import React, { Component } from 'react';

import Icon from 'components/Icon';
import Link from 'components/Link';

import CheckIcon from 'images/sprite/check-circle.svg';

import './styles.scss';

class PackageCard extends Component {
  render() {
    return (
      <div className="packageCard">
        <div className="row">
          <div className="column packageCard__type">Premium</div>
        </div>
        <div className="row">
          <div className="column">
            <h1 className="packageCard__price">$1,200</h1>
          </div>
        </div>
        <div className="row mb-md">
          <div className="column">
            <p className="packageCard__txtThin">
              3 MONTHS 90 DAYS 5 POSTS/WEEK
            </p>
            <p className="packageCard__txtThin">5 Posts per week 3 months</p>
          </div>
        </div>
        <div className="row align-center align-middle mb-sm">
          <div className="column shrink npr">
            <Icon glyph={CheckIcon} size={18} />
          </div>
          <div className="column shrink npl packageCard__txtThick">
            Action Plan
          </div>
        </div>
        <div className="row align-center align-middle mb-sm">
          <div className="column shrink npr">
            <Icon glyph={CheckIcon} size={18} />
          </div>
          <div className="column shrink npl packageCard__txtThick">
            Page/Channel Evaluation
          </div>
        </div>
        <div className="row align-center align-middle mb-md">
          <div className="column shrink npr">
            <Icon glyph={CheckIcon} size={18} />
          </div>
          <div className="column shrink npl packageCard__txtThick">
            Schedule Posts
          </div>
        </div>
        <div className="row mb-md">
          <div className="column">
            <p className="packageCard__txtThin">30 Days Management Duration</p>
            <p className="packageCard__txtThin">29 Days Delivery time</p>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <Link className="packageCard__btnSelect">Select</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default PackageCard;
