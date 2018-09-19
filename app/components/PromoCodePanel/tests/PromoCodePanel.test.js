import React from 'react';
import { shallow } from 'enzyme';
import Form from 'react-formal';

import PromoCodePanel from 'components/PromoCodePanel';

describe('<PromoCodePanel />', () => {
  it("shouldn't throw error if no props are specified", () => {
    try {
      shallow(<PromoCodePanel />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should render loading button if `isLoding` prop is specified', () => {
    const renderedComponent = shallow(<PromoCodePanel isLoading />);
    expect(renderedComponent.find('.button').prop('isLoading')).toEqual(true);
  });

  it('redeemPromoCode should be fired when form is submitted', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(<PromoCodePanel redeemPromoCode={spy} />);
    renderedComponent.setState({ model: { code: 'text' } });
    renderedComponent.find(Form).simulate('submit');
    expect(spy).toHaveBeenCalled();
  });
});
