import React from 'react';
import { shallow, mount } from 'enzyme';
import { create } from 'react-test-renderer';

import CartItem from 'components/CartItem';

const lineItem = {
  image: {
    src:
      'https://cdn.shopify.com/s/files/1/1917/4769/products/Volc_-_orig.png?v=1492277039',
  },
  title: 'Volcano Vaporizer with Solid Valve',
  variant_title: 'Default Title',
  quantity: 1,
  line_price: '624.95',
};

describe('<CartItem />', () => {
  it("shouldn't throw error if no props are specified", () => {
    try {
      shallow(<CartItem />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('decreaseQuantity should be fired when appropriate button input has been clicked', () => {
    const spy = jest.fn();
    const renderedComponent = mount(
      <CartItem lineItem={lineItem} decreaseQuantity={spy} />
    );
    renderedComponent
      .find('button')
      .at(0)
      .simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('increaseQuantity should be fired when appropriate button input has been clicked', () => {
    const spy = jest.fn();
    const renderedComponent = mount(
      <CartItem lineItem={lineItem} increaseQuantity={spy} />
    );
    renderedComponent
      .find('button')
      .at(1)
      .simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('renders data if provided', () => {
    const component = create(<CartItem lineItem={lineItem} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
