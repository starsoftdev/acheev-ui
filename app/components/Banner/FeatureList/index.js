// @flow

import * as React from 'react';

import { fromJS } from 'immutable';

import UserIcon from 'images/sprite/user.svg';
import RecommendIcon from 'images/sprite/recommend.svg';
import ReviewsIcon from 'images/sprite/product-reviews.svg';

import ItemList from './ItemList';
import './styles.scss';

const data = fromJS([
  {
    icon: UserIcon,
    title: '1,000,000',
    subTitle: 'Annual users',
  },
  {
    icon: ReviewsIcon,
    title: '60,000',
    subTitle: 'Product reviews',
  },
  {
    icon: RecommendIcon,
    title: '9/10 Users',
    subTitle: 'Recommend Lift & Co.',
  },
]);

const BannerFeatureList = () => (
  <div className="bannerFeatureList row mb-lg">
    <div className="small-12 large-12 column">
      <h2 className="bannerFeatureList__title">
        Search smarter. Consume confidently.
      </h2>
    </div>
    <div className="small-12 large-8 large-offset-2 columm">
      <div className="bannerFeatureList__subTitle">
        We&#39;ve created an algorithm that maps millions of user and product
        data points to deliver personalized cannabis recommendations.
      </div>
    </div>

    <div className="small-12 large-12 columm">
      <ItemList data={data} />
    </div>
  </div>
);

export default BannerFeatureList;
