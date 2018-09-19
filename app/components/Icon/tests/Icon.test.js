import React from 'react';
import { shallow } from 'enzyme';
import Icon from 'components/Icon';
import vapeIcon from 'images/sprite/vape.svg';

describe('<Icon />', () => {
  it('should render correct svg', () => {
    const renderedComponent = shallow(<Icon glyph={vapeIcon} />);
    expect(renderedComponent.find('svg').prop('viewBox')).toEqual(
      vapeIcon.viewBox
    );
    expect(renderedComponent.find('use').prop('xlinkHref')).toEqual(
      `#${vapeIcon.id}`
    );
  });
  it('should have correct class from prop `className`', () => {
    const renderedComponent = shallow(
      <Icon className="Hello" glyph={vapeIcon} />
    );
    expect(renderedComponent.hasClass('Hello')).toEqual(true);
  });
  it('should have proper width and height', () => {
    const renderedComponent = shallow(
      <Icon glyph={vapeIcon} width={20} height={25} />
    );
    expect(renderedComponent.find('svg').prop('width')).toEqual(20);
    expect(renderedComponent.find('svg').prop('height')).toEqual(25);
  });
  it('should have proper size', () => {
    const renderedComponent = shallow(<Icon glyph={vapeIcon} size={30} />);
    expect(renderedComponent.find('svg').prop('width')).toEqual(30);
    expect(renderedComponent.find('svg').prop('height')).toEqual(30);
  });
});
