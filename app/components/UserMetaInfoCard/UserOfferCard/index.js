// @flow

import React, { Component } from 'react';

import Icon from 'components/Icon';

import RightArrowIcon from 'images/sprite/right-arrow.svg';

import './styles.scss';

type Props = {
  className?: string,
  title: string,
  price: number,
};

class UserOfferCard extends Component<Props> {
  render() {
    const { className = '', title, price } = this.props;
    const cx = className ? `userOfferCard ${className}` : 'userOfferCard';
    return (
      <div className={cx}>
        <div className="row align-middle">
          <div className="column">
            <div className="userOfferCard__title">{title}</div>
            <div className="userOfferCard__price">
              Starting at <span>${price}</span>
            </div>
          </div>
          <div className="column shrink">
            <Icon glyph={RightArrowIcon} width={20} height={15} />
          </div>
        </div>
      </div>
    );
  }
}

export default UserOfferCard;
