// @flow

import React, { Component, Fragment } from 'react';
import { cloneDeep } from 'lodash-es';
import update from 'immutability-helper';

import { history } from 'components/ConnectedRouter';
import StarRating from 'components/StarRating';
import Button from 'components/Button';
import Icon from 'components/Icon';

import MarkerIcon from 'images/sprite/map-marker.svg';
import ProfileIcon from 'images/sprite/profile-white.svg';
import ClockIcon from 'images/sprite/clock-o.svg';

import './styles.scss';

type Props = {
  user: Object,
  offer?: Object,
  checkout?: Object,
  orderOffer?: Function,
};

type State = {
  checkout: Object,
};

class UserInfoCard extends Component<Props, State> {
  static getDerivedStateFromProps({ checkout }: Props) {
    return {
      checkout: checkout && checkout.toJS(),
    };
  }
  state = {
    checkout: {},
  };
  handleOrderChange = (extra: Object) => {
    const currentCheckout = cloneDeep(this.state.checkout);
    const currentExtraIds = currentCheckout.extra_services.map(i => i._id);
    const pos = currentExtraIds.indexOf(extra._id);
    if (pos === -1) {
      this.setState(state =>
        update(state, {
          checkout: { extra_services: { $push: [extra] } },
        })
      );
    } else {
      this.setState(state =>
        update(state, {
          checkout: {
            extra_services: {
              $splice: [[pos, 1]],
            },
          },
        })
      );
    }
  };
  checkExtraService = (service: Object) => {
    const { checkout } = this.state;
    const currentExtraIds = checkout.extra_services.map(i => i._id);
    return currentExtraIds.indexOf(service.get('_id')) !== -1;
  };
  order = () => {
    if (this.props.orderOffer) {
      this.props.orderOffer(this.state.checkout);
      history.push('/checkout');
    }
  };
  render() {
    const { user, offer } = this.props;
    const { checkout } = this.state;
    let orderPrice = this.props.checkout && this.props.checkout.price;
    if (checkout && checkout.extra_services) {
      checkout.extra_services.map(extra => {
        orderPrice += extra.price;
        return extra;
      });
    }
    return (
      <div className="userInfoCard">
        <div className="row align-center mb-md">
          <div className="column shrink">
            <div className="userInfoCard__avatarContainer">
              <div
                className="userInfoCard__profileImg"
                style={{
                  backgroundImage: `url(${user &&
                    user.getIn(['image', 'src'])})`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="row column text-center mb-mn">
          <h1 className="userInfoCard__username">
            {user && user.get('username')}
          </h1>
        </div>
        <div className="row column text-center mb-lg">
          <p className="userInfoCard__title">
            {user && (user.getIn(['profile', 'title']) || 'No Title')}
          </p>
        </div>
        <div className="row align-center mb-xl">
          <div className="column shrink">
            <StarRating initialRating={0} size={23} />
            <span className="userInfoCard__reviews">0.0 (0 reviews)</span>
          </div>
        </div>
        <div className="row mb-lg">
          <div className="column pr-xl pl-xl">
            <Button className="userInfoCard__btnContact bg-gradient">
              Contact Me
            </Button>
          </div>
        </div>
        <div className="userInfoCard__divider mb-lg" />
        <div className="userInfoCard__stats mb-md">
          <div className="row align-middle mb-sm">
            <div className="column shrink npr">
              <Icon glyph={MarkerIcon} size={20} />
            </div>
            <div className="userInfoCard__statsLabel column">From</div>
            <div className="userInfoCard__statsValue column">Australia</div>
          </div>
          <div className="row align-middle mb-sm">
            <div className="column shrink npr">
              <Icon glyph={ProfileIcon} size={20} />
            </div>
            <div className="userInfoCard__statsLabel column">Member Since</div>
            <div className="userInfoCard__statsValue column">2015</div>
          </div>
          <div className="row align-middle mb-sm">
            <div className="column shrink npr">
              <Icon glyph={ClockIcon} size={20} />
            </div>
            <div className="userInfoCard__statsLabel column shrink">
              Avg. Response Time
            </div>
            <div className="userInfoCard__statsValue column">5 hour</div>
          </div>
          <div className="row align-middle mb-sm">
            <div className="column shrink npr">
              <Icon glyph={MarkerIcon} size={20} />
            </div>
            <div className="userInfoCard__statsLabel column">
              Recent Delivery
            </div>
            <div className="userInfoCard__statsValue column">
              About 11 hours
            </div>
          </div>
        </div>
        {offer && (
          <Fragment>
            <div className="userInfoCard__divider mb-mn" />
            <div className="row mb-mn">
              <div className="column pr-xl pl-xl">
                <Button
                  className="userInfoCard__btnContact bg-gradient"
                  onClick={this.order}
                >
                  Order Now ($
                  {orderPrice})
                </Button>
              </div>
            </div>
            <div className="userInfoCard__divider mb-mn" />
            {offer.get('extra_services') && (
              <div className="userInfoCard__extraServices mb-md">
                {offer.get('extra_services').map(extra => (
                  <div
                    className="row align-middle mb-sm"
                    key={extra.get('_id')}
                  >
                    <div className="column shrink npr">
                      <input
                        type="checkbox"
                        value={extra.get('_id')}
                        checked={this.checkExtraService(extra)}
                        onChange={() => this.handleOrderChange(extra.toJS())}
                      />
                    </div>
                    <div className="userInfoCard__extraServiceName column shrink">
                      {extra.get('description')}
                    </div>
                    <div className="userInfoCard__extraServicePrice column">
                      ${extra.get('price')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

export default UserInfoCard;
