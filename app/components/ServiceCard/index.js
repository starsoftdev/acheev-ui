// @flow

import React, { Component } from 'react';
import cx from 'classnames';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import Icon from 'components/Icon';

import StarIcon from 'images/sprite/star.svg';

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
          <h2 className="fs-mx">{data.get('offer_name')}</h2>
          <div
            className="serviceCard__creator"
            onClick={this.goToMemberProfile}
            role="Button"
          >
            {data.getIn(['user', 'username'])}
          </div>
        </div>
        <div className="serviceCard__divider" />
        <div className="serviceCard__toolbar">
          <div className="row align-middle">
            <div className="column shrink npr">
              <Icon className="serviceCard__icon" glyph={StarIcon} size={23} />
            </div>
            <div className="column shrink npl">
              <span className="serviceCard__rate">4</span>
            </div>
            <div className="serviceCard__priceDesc column npr">Starting At</div>
            <div className="serviceCard__price column shrink text-right">
              ${data.get('price')}
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default ServiceCard;
