// @flow

import React, { Component } from 'react';
import cx from 'classnames';

import { history } from 'components/ConnectedRouter';
import StarRating from 'components/StarRating';
import Link from 'components/Link';
import Icon from 'components/Icon';

import ListIcon from 'images/sprite/th-list.svg';
import HeartIcon from 'images/sprite/heart.svg';

import './styles.scss';

type Props = {
  data: Object,
  bigImage?: boolean,
};

class OfferCard extends Component<Props, {}> {
  goToMemberProfile = (e: Object) => {
    e.preventDefault();
    history.push(`/member/${this.props.data.getIn(['user', 'username'])}`);
  };
  render() {
    const { data, bigImage } = this.props;
    return (
      <Link to={`/offers/${data.get('_id')}`} className="offerCard">
        <div
          className={cx('offerCard__image', {
            'offerCard__image--big': bigImage,
          })}
          style={{
            backgroundImage: `url('${data.getIn(['gallery', 0, 'src'])}')`,
          }}
        />
        <div className="offerCard__info">
          <div
            className="offerCard__creator"
            onClick={this.goToMemberProfile}
            role="Button"
          >
            <div
              className="offerCard__avatar mb-tn"
              style={{
                backgroundImage: `url('${data.getIn([
                  'user',
                  'image',
                  'src',
                ])}')`,
              }}
            />
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
            <div className="column shrink">
              <Icon className="offerCard__icon" glyph={HeartIcon} size={22} />
            </div>
            <div className="column shrink">
              <Icon className="offerCard__icon" glyph={ListIcon} size={22} />
            </div>
            <div className="offerCard__price column expand text-right">
              ${data.get('price')}
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default OfferCard;
