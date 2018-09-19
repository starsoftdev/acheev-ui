import React from 'react';
import { shallow } from 'enzyme';

import CartAction from 'components/CartAction';

import SampleIcon from 'images/sprite/chevron-down.svg';

describe('<CartAction />', () => {
  it('onClick should be fired when `.cartAction` is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(<CartAction onClick={spy} />);
    renderedComponent.find('.cartAction').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should pass glyph and size to <Icon />', () => {
    const renderedComponent = shallow(
      <CartAction glyph={SampleIcon} size={99} />
    );
    expect(renderedComponent.find('Icon').prop('glyph')).toEqual(SampleIcon);
    expect(renderedComponent.find('Icon').prop('size')).toEqual(99);
  });
});
