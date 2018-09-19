import React from 'react';
import { shallow } from 'enzyme';
import EffectItem from 'components/TagList/EffectItem';
import Icon from 'components/Icon';
import RangeSlider from 'components/RangeSlider';
import ProgressBar from 'components/ProgressBar';
import IconClose from 'images/sprite/close.svg';

const data = {
  label: 'Label',
  value: 5,
};

describe('<EffectItem />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<EffectItem />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
  it('should have correct className', () => {
    const renderedComponent = shallow(
      <EffectItem data={data} className="hey" />
    );
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should have RangeSlider with value when readOnly is false', () => {
    const renderedComponent = shallow(
      <EffectItem data={data} className="hey" />
    );
    expect(renderedComponent.find(RangeSlider).prop('value')).toEqual(
      data.value
    );
  });

  it('should have ProgressBar with value when readOnly is true', () => {
    const renderedComponent = shallow(
      <EffectItem data={data} className="hey" readOnly />
    );
    expect(renderedComponent.find(ProgressBar).prop('value')).toEqual(
      data.value
    );
  });

  it('should have correct remove button by default', () => {
    const renderedComponent = shallow(
      <EffectItem data={data} className="hey" />
    );
    expect(renderedComponent.find('.effectItem__close').prop('glyph')).toEqual(
      IconClose
    );
  });

  it('should not have remove button when it is read only', () => {
    const renderedComponent = shallow(
      <EffectItem data={data} className="hey" readOnly />
    );
    expect(renderedComponent.find('effectItem__close')).toHaveLength(0);
  });

  it('onRemove should be fired', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <EffectItem data={data} onRemove={spy} />
    );
    renderedComponent.find(Icon).simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});
