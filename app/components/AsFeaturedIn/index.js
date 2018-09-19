// @flow

import * as React from 'react';
import { fromJS } from 'immutable';

import Logo1 from 'images/featured/1.jpg';
import Logo2 from 'images/featured/2.jpg';
import Logo3 from 'images/featured/3.jpg';
import Logo4 from 'images/featured/4.jpg';
import Logo5 from 'images/featured/5.jpg';
import Logo6 from 'images/featured/6.jpg';
import Logo7 from 'images/featured/7.jpg';
import Logo8 from 'images/featured/8.jpg';
import Logo9 from 'images/featured/9.jpg';

import FlexImagesContainer from './FlexImagesContainer';

export const topRowImages = fromJS([
  {
    alt: 'Featured In Media 1',
    src: Logo1,
  },
  {
    alt: 'Featured In Media 2',
    src: Logo2,
  },
  {
    alt: 'Featured In Media 3',
    src: Logo3,
  },
  {
    alt: 'Featured In Media 4',
    src: Logo4,
  },
  {
    alt: 'Featured In Media 5',
    src: Logo5,
  },
  {
    alt: 'Featured In Media 6',
    src: Logo6,
  },
]);

export const bottomRowImages = fromJS([
  {
    alt: 'Featured In Media 7',
    src: Logo7,
  },
  {
    alt: 'Featured In Media 8',
    src: Logo8,
  },
  {
    alt: 'Featured In Media 9',
    src: Logo9,
  },
]);

const AsFeaturedIn = () => (
  <div className="mb-xxl">
    <h2 className="mb-xl">As featured in</h2>
    <FlexImagesContainer images={topRowImages} size="small" />
    <FlexImagesContainer images={bottomRowImages} size="medium" />
  </div>
);

export default AsFeaturedIn;
