// @flow

import React, { Component } from 'react';

import StarRating from 'components/StarRating';

import './styles.scss';

type Props = {
  data: Object,
};

class OfferCard extends Component<Props, {}> {
  render() {
    const { data } = this.props;
    return (
      <div className="offerCard">
        <div
          className="offerCard__image"
          style={{
            backgroundImage: `url('${data.getIn(['gallery', 0, 'src'])}')`,
          }}
        />
        <div className="offerCard__info">
          <div className="offerCard__creator">
            <div className="offerCard__avatar mb-tn" />
            {data.getIn(['user', 'username'])}
          </div>
          <h2 className="fs-mx nm">{data.get('offer_name')}</h2>
        </div>
        <div className="offerCard__rating">
          <div className="row align-middle">
            <div className="column shrink">
              <StarRating initialRating={4} size={23} />
            </div>
            <div className="offerCard__rate column">4</div>
          </div>
        </div>
        <div className="offerCard__divider" />
        <div className="offerCard__toolbar">
          <div className="row align-middle">
            <div className="offerCard__price column shrink">
              ${data.get('price')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OfferCard;
