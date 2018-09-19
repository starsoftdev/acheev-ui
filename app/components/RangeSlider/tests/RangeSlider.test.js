import React from 'react';
import { shallow } from 'enzyme';
import RangeSlider from 'components/RangeSlider';
import Slider from 'rc-slider';

describe('<RangeSlider />', () => {
  it('should apply given className', () => {
    const renderedComponent = shallow(<RangeSlider className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should apply default props', () => {
    const renderedComponent = shallow(<RangeSlider />);
    expect(renderedComponent.find(Slider).prop('min')).toEqual(0);
    expect(renderedComponent.find(Slider).prop('max')).toEqual(10);
    expect(renderedComponent.find(Slider).prop('defaultValue')).toEqual(0);
    expect(renderedComponent.find(Slider).prop('step')).toEqual(1);
  });

  it('should apply correct props values', () => {
    const renderedComponent = shallow(
      <RangeSlider maxValue={8} minValue={2} step={2} value={4} />
    );
    expect(renderedComponent.find(Slider).prop('min')).toEqual(2);
    expect(renderedComponent.find(Slider).prop('max')).toEqual(8);
    expect(renderedComponent.find(Slider).prop('defaultValue')).toEqual(4);
    expect(renderedComponent.find(Slider).prop('step')).toEqual(2);
  });
});
