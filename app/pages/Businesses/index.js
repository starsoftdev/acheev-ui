// @flow

import * as React from 'react';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import HighlightCards from 'components/HighlightCards';

import DrImg from './find-doctor.jpg';
import ProducerImg from './find-producer.jpg';

const cards = fromJS([
  {
    src: DrImg,
    title: 'Find a doctor',
    desc: 'Scroll through our approved list of clinics and physicians near you',
    btnText: 'Browse',
    linkTo: '/clinics',
  },
  {
    src: ProducerImg,
    title: 'Find a licensed producer',
    desc:
      'Read through patient reviews, register as a patient and find all the company information you need',
    btnText: 'Browse',
    linkTo: '/producers',
  },
]);

const BusinessesPage = () => (
  <div>
    <Breadcrumbs
      path={fromJS([
        {
          link: '',
          title: 'Businesses',
        },
      ])}
    />
    <div className="row column">
      <h1 className="c-secondary mb-lg t-capitalize">find it with lift</h1>
    </div>
    <HighlightCards cards={cards} centered={false} />
  </div>
);

export default BusinessesPage;
