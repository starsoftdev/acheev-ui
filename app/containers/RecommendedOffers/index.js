// @flow

import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { generate } from 'shortid';

import Carousel from 'components/Carousel';
import OfferCard from 'components/OfferCard';

import './styles.scss';

const MOCK_OFFER = fromJS({
  offer_name: 'Test Job',
  category: 'Graphic Design',
  sub_category: 'Logo Design',
  currency: 'USD', // optional
  price: 20,
  time_of_delivery: 5, // 5 days
  description: 'This is a test offer.',
  opening_message: 'This is a test opening message.',
  status: 'published',
  tags: ['arshdeep', 'kolby', 'design'],
  gallery: [
    {
      position: 0,
      type: 'small-thumbnail',
      src:
        'http://acheev-backend.s3-us-west-2.amazonaws.com/offer-thumbnails-5bab5596b728ec3a604f3bf8/1538387390693.png',
      alt: 'offer thumbnail',
    },
  ],
  extra_services: [
    {
      description: 'Extra Service 1',
      currency: 'USD', // optional
      price: 5.0,
    },
    {
      description: 'Extra Service 2',
      currency: 'USD', // optional
      price: 5.5,
    },
  ],
  faq: [
    {
      question: 'Do you translate to English as well?',
      answer: 'Yes. I also translate from English to Hebrew.',
    },
  ],
  user: {
    first_name: 'angie',
    last_name: 'lucas',
    username: `angie.lucas${Date.now()}`,
    email: `angie.lucas${Date.now()}@gmail.com`,
  },
});

const carouselSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

class RecommendedOffersContainer extends Component {
  render() {
    return (
      <div className="recommendedOffers">
        <div className="row">
          <div className="column">
            <h1 className="recommendedOffers__title">
              Recommended For You In Social Media Marketing
            </h1>
          </div>
        </div>

        <div className="recommendedOffers__carousel">
          <Carousel {...carouselSettings}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => (
              <div className="recommendedOffers__item" key={generate()}>
                <OfferCard data={MOCK_OFFER} bigImage />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    );
  }
}

export default RecommendedOffersContainer;
