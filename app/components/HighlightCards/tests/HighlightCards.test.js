import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import HighlightCards from 'components/HighlightCards';

import DrImg from 'pages/Businesses/find-doctor.jpg';
import ProducerImg from 'pages/Businesses/find-producer.jpg';
import DispensaryImg from 'pages/Businesses/find-dispensary.png';

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
  {
    src: DispensaryImg,
    title: 'Find a dispensary',
    desc: 'We can help you find a local dispensary near you',
    btnText: 'Browse',
    linkTo: '/dispensaries',
  },
]);

describe('<HighlightCards />', () => {
  it("shouldn't throw error if `cards` is not specified", () => {
    try {
      shallow(<HighlightCards />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should be centered if `centered` prop is specified', () => {
    const renderedComponent = shallow(
      <HighlightCards cards={cards} centered />
    );
    expect(
      renderedComponent
        .find('img')
        .first()
        .prop('style')
    ).toEqual({
      height: '160px',
    });
  });

  it('should render BorderedTitle if `borderedTitle` prop is specified', () => {
    const renderedComponent = shallow(
      <HighlightCards cards={cards} borderedTitle />
    );
    expect(renderedComponent.find('BorderedTitle').length).toEqual(cards.size);
  });

  it('should render h4 if `borderedTitle` prop is not specified', () => {
    const renderedComponent = shallow(<HighlightCards cards={cards} />);
    expect(renderedComponent.find('h4').length).toEqual(cards.size);
  });

  it('should render BorderedTitle with `centered` prop if both `borderedTitle` and `centered` props are specified', () => {
    const renderedComponent = shallow(
      <HighlightCards cards={cards} borderedTitle centered />
    );
    expect(
      renderedComponent
        .find('BorderedTitle')
        .first()
        .prop('centered')
    ).toEqual(true);
  });
});
