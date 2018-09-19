// @flow

import * as React from 'react';

import { generate } from 'shortid';
import { fromJS } from 'immutable';

import Icon from 'components/Icon';
import IconArrow from 'images/sprite/arrow-right.svg';
import LogoImage1 from './logo-image1.png';
import LogoImage2 from './logo-image2.png';
import LogoImage3 from './logo-image3.png';
import './styles.scss';

const data = fromJS([
  {
    image: LogoImage1,
    title: '‘Trip advisers’ help newbies navigate world of weed',
    link:
      'https://www.thestar.com/news/cannabis/2018/07/27/trip-advisers-help-newbies-navigate-world-of-weed.html',
  },
  {
    image: LogoImage2,
    title: 'Why I traded in my wine for weed',
    link:
      'https://www.macleans.ca/society/health/why-i-traded-in-my-wine-for-weed/',
  },
  {
    image: LogoImage3,
    title: `10 resources if you're new or interested in the cannabis community`,
    link:
      'http://www.canadianliving.com/life-and-relationships/community-and-current-events/article/10-resources-if-you-re-new-or-interested-in-the-cannabis-community',
  },
]);

const FeaturedPress = () => (
  <div className="featuredPress row mb-lg">
    <div className="column small-12 mb-lg text-center">
      <h2 className="featuredPress__header">Featured press</h2>
    </div>
    {data.map(item => (
      <div className="column medium-4 small-12 mb-md" key={generate()}>
        <div className="featuredPress__item align-self-middle">
          <img
            className="featuredPress__logo"
            src={item.get('image', '')}
            alt="Logo"
          />
          <div className="featuredPress__title">{item.get('title', '')}</div>
          <a
            className="featuredPress__link"
            href={item.get('link', '')}
            target="_blank"
          >
            Read full story
            <Icon className="featuredPress__icon" glyph={IconArrow} size={20} />
          </a>
        </div>
      </div>
    ))}
  </div>
);

export default FeaturedPress;
