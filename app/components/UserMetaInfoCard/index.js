// @flow

import React, { Component } from 'react';

import Icon from 'components/Icon';

import MarkerIcon from 'images/sprite/map-marker.svg';

import UserOfferCard from './UserOfferCard';

import './styles.scss';

class UserMetaInfoCard extends Component {
  render() {
    return (
      <div className="userMetaInfoCard">
        <div className="row mb-md">
          <div className="column small-12 pr-xl pl-xl mb-md">
            <h1 className="userMetaInfoCard__title">Pro Verified In</h1>
          </div>
          <div className="column small-12 pr-xl pl-xl">
            <div className="row mb-sm">
              <div className="column shrink npr">
                <Icon glyph={MarkerIcon} size={20} />
              </div>
              <div className="userMetaInfoCard__label column">
                Business Cards
              </div>
            </div>
            <div className="row mb-sm">
              <div className="column shrink npr">
                <Icon glyph={MarkerIcon} size={20} />
              </div>
              <div className="userMetaInfoCard__label column">
                Infographic Design
              </div>
            </div>
            <div className="row mb-sm">
              <div className="column shrink npr">
                <Icon glyph={MarkerIcon} size={20} />
              </div>
              <div className="userMetaInfoCard__label column">
                Social Marketing
              </div>
            </div>
          </div>
        </div>
        <div className="userInfoCard__divider mb-lg" />
        <div className="row mb-lg">
          <div className="column small-12 pr-xl pl-xl">
            <h1 className="userMetaInfoCard__title mb-md">Description</h1>
            <p className="userMetaInfoCard__description">
              {`10+ years experience in digital marketing. I am a Certified Marketing Professional with the Australian Marketing Institute, AMAMI CPM. I run my own Digital Marketing agency in Australia. Specialise in: Digital Marketing, Social Media, Web, Content Marketing, SEO, Graphic Design. BUSINESS HOURS: MONDAY-FRIDAY AEST`}
            </p>
          </div>
        </div>
        <div className="userInfoCard__divider mb-lg" />
        <div className="row mb-md">
          <div className="column small-12 pr-xl pl-xl">
            <h1 className="userMetaInfoCard__title">
              Other Social Media Marketing Services I Offer
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="column small-12 pr-lg pl-lg">
            <UserOfferCard
              className="mb-sm"
              title="Social Ad Campaigns"
              price={150}
            />
            <UserOfferCard
              className="mb-sm"
              title="Consultation & Audience Research"
              price={1000}
            />
            <UserOfferCard
              className="mb-sm"
              title="Analytics & Tracking"
              price={150}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default UserMetaInfoCard;
