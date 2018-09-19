import React from 'react';
import { shallow } from 'enzyme';
import Slick from 'react-slick';
import Carousel from 'components/Carousel';

describe('<Carousel />', () => {
  it('should apply given className', () => {
    const renderedComponent = shallow(<Carousel className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should apply fullHeight className', () => {
    const renderedComponent = shallow(<Carousel fullHeight />);
    expect(renderedComponent.hasClass('fullHeight')).toEqual(true);
  });

  it('should render specified prevArrow', () => {
    const renderedComponent = shallow(<Carousel prevArrow={<div>Prev</div>} />);
    expect(renderedComponent.find(Slick).prop('prevArrow')).toEqual(
      <div>Prev</div>
    );
  });

  it('should render specified nextArrow', () => {
    const renderedComponent = shallow(<Carousel nextArrow={<div>Next</div>} />);
    expect(renderedComponent.find(Slick).prop('nextArrow')).toEqual(
      <div>Next</div>
    );
  });
});
