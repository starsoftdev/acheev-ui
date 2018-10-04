// @flow

import React, { Component } from 'react';

import StarRating from 'components/StarRating';
import Button from 'components/Button';
import Icon from 'components/Icon';

import MarkerIcon from 'images/sprite/map-marker.svg';
import ProfileIcon from 'images/sprite/profile-white.svg';
import ClockIcon from 'images/sprite/clock-o.svg';

import './styles.scss';

class UserInfoCard extends Component {
  render() {
    return (
      <div className="userInfoCard">
        <div className="row align-center mb-md">
          <div className="column shrink">
            <div className="userInfoCard__avatarContainer">
              <div className="userInfoCard__profileImg" />
            </div>
          </div>
        </div>
        <div className="row column text-center mb-mn">
          <h1 className="userInfoCard__username">DigitalPartners</h1>
        </div>
        <div className="row column text-center mb-lg">
          <p className="userInfoCard__title">
            Digital Marketing For SME Business
          </p>
        </div>
        <div className="row align-center mb-xl">
          <div className="column shrink">
            <StarRating initialRating={4} size={23} />
            <span className="userInfoCard__reviews">4.0 (234 reviews)</span>
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
        <div className="userInfoCard__stats">
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
      </div>
    );
  }
}

export default UserInfoCard;
