import React from 'react';
import { shallow } from 'enzyme';
import StarRating from 'components/StarRating';
import Icon from 'components/Icon';
import Rating from 'react-rating';
import Star from 'images/sprite/star.svg';
import StarHollow from 'images/sprite/star-hollow.svg';

describe('<StarRating />', () => {
  it('should render correct icons for stars', () => {
    const renderedComponent = shallow(<StarRating />);
    expect(renderedComponent.find(Rating).prop('emptySymbol')).toEqual(
      <Icon glyph={StarHollow} size={16} />
    );
    expect(renderedComponent.find(Rating).prop('fullSymbol')).toEqual(
      <Icon glyph={Star} size={16} />
    );
  });

  it('should have correct class from prop `className`', () => {
    const renderedComponent = shallow(<StarRating className="Hello" />);
    expect(renderedComponent.hasClass('Hello')).toEqual(true);
  });

  it('should have proper initialRating', () => {
    const renderedComponent = shallow(<StarRating initialRating={4} />);
    expect(renderedComponent.find(Rating).prop('initialRating')).toEqual(4);
  });

  it('should enable half star rating', () => {
    const renderedComponent = shallow(<StarRating />);
    expect(renderedComponent.find(Rating).prop('fractions')).toEqual(2);
  });

  it('should have default read only as true', () => {
    const renderedComponent = shallow(<StarRating />);
    expect(renderedComponent.find(Rating).prop('readonly')).toEqual(true);
  });

  it('should have false read only', () => {
    const renderedComponent = shallow(<StarRating readonly={false} />);
    expect(renderedComponent.find(Rating).prop('readonly')).toEqual(false);
  });
});
