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

class ServiceCard extends Component<Props, {}> {
  goToMemberProfile = (e: Object) => {
    e.preventDefault();
    history.push(`/member/${this.props.data.getIn(['user', 'username'])}`);
  };
  render() {
    const { data, bigImage } = this.props;
    return (
      <Link to={`/offers/${data.get('_id')}`} className="serviceCard">
        <div
          className={cx('serviceCard__image', {
            'serviceCard__image--big': bigImage,
          })}
          style={{
            backgroundImage: `url('${data.getIn(['gallery', 0, 'src'])}')`,
          }}
        />
        <div className="serviceCard__info">
          <div
            className="serviceCard__creator"
            onClick={this.goToMemberProfile}
            role="Button"
          >
            <div
              className="serviceCard__avatar mb-tn"
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
        <div className="serviceCard__rating">
          <div className="row align-middle">
            <div className="column shrink">
              <StarRating initialRating={4} size={23} />
            </div>
            <div className="serviceCard__rate column">4</div>
          </div>
        </div>
        <div className="serviceCard__divider" />
        <div className="serviceCard__toolbar">
          <div className="row align-middle">
            <div className="column shrink">
              <Icon className="serviceCard__icon" glyph={HeartIcon} size={22} />
            </div>
            <div className="column shrink">
              <Icon className="serviceCard__icon" glyph={ListIcon} size={22} />
            </div>
            <div className="serviceCard__price column expand text-right">
              ${data.get('price')}
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default ServiceCard;
