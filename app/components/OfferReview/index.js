// @flow

import React, { Component } from 'react';

import StarRating from 'components/StarRating';

import './styles.scss';

class OfferReview extends Component {
  render() {
    return (
      <div className="offerReview">
        <div className="row">
          <div className="column shrink">
            <div className="offerReview__userImg" />
          </div>
          <div className="column">
            <div className="row align-middle mb-sm">
              <div className="column shrink npr">
                <h1 className="offerReview__username">Gary Ruiz</h1>
              </div>
              <div className="column shrink">
                <StarRating initialRating={4} size={12} />
              </div>
              <div className="column offerReview__time">2 days ago</div>
            </div>
            <div className="row">
              <div className="column offerReview__content">
                {`He is AMAZING!! I have spent thousands on here and he is literally one of the BEST. Get off your wallet and spend the money for greatness!!`}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OfferReview;
