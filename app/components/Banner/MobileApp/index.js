// @flow

import * as React from 'react';

import './styles.scss';
import BannerImage from './banner-image1.png';

const MobileAppBanner = () => (
  <div className="mobileAppBanner">
    <div className="mobileAppBanner__inner row">
      <div className="small-12 large-6 column align-self-middle">
        <h1 className="mobileAppBanner__title">
          <strong>iPhone &amp; Android App are Live.</strong>
        </h1>
        <div className="mobileAppBanner__subTitle">
          Take Acheev with you on the go. Book a freelancher, keep track of
          multiple jobs, work remotely &amp; never stop learning.
        </div>
        <div className="mb-xl">
          <a
            className="button coral mr-md"
            href="https://itunes.apple.com/us/app/fit-radio-workout-music-running-cardio-coach/id440844625?mt=8"
            target="_blank"
          >
            App Store
          </a>
          <a
            className="button coral"
            href="https://play.google.com/store/apps/details?id=com.fitradio&hl=en"
            target="_blank"
          >
            Google Play
          </a>
        </div>
      </div>
      <div className="mobileAppBanner__imageContainer small-12 large-6">
        <img
          className="mobileAppBanner__image"
          alt="banner"
          src={BannerImage}
        />
      </div>
    </div>
  </div>
);

export default MobileAppBanner;
