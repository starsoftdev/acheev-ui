// @flow

import * as React from 'react';

import Link from 'components/Link';
import Button from 'components/Button';
import bannerImage from './banner-image1.jpg';
import './styles.scss';

const BannerNews = () => (
  <div className="bannerNews mb-lg">
    <div className="row">
      <div className="small-12 large-8 column mb-md">
        <img className="bannerNews__image" src={bannerImage} alt="News" />
      </div>
      <div className="small-10 large-4 column align-self-middle mb-md">
        <h2 className="bannerNews__title mb-sm">Stay informed</h2>
        <div className="bannerNews__subTitle mb-xl">
          In the ever-changing world of cannabis, our magazine will keep you in
          the loop.
        </div>
        <Button className="button secondary" element={Link} to="/magazine">
          Read now
        </Button>
      </div>
    </div>
  </div>
);

export default BannerNews;
