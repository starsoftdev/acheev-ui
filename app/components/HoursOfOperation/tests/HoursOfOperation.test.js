import React from 'react';
import { shallow } from 'enzyme';

import HoursOfOperation from 'components/HoursOfOperation';
import Select from 'components/CustomSelect';

import DEFAULT_HOURS_OF_OPERATION from 'enum/HoursOfOperation';

describe('<HoursOfOperation />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<HoursOfOperation />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should fire `onChange` if day is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <HoursOfOperation data={DEFAULT_HOURS_OF_OPERATION} onChange={spy} />
    );
    renderedComponent
      .find('.hoursOfOperation__day')
      .first()
      .simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should fire `onChange` if Select is changed', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <HoursOfOperation data={DEFAULT_HOURS_OF_OPERATION} onChange={spy} />
    );
    renderedComponent
      .find(Select)
      .first()
      .simulate('change', { value: 'hey' });
    expect(spy).toHaveBeenCalled();
  });

  it('should render 5 working days given `DEFAULT_HOURS_OF_OPERATION`', () => {
    const renderedComponent = shallow(
      <HoursOfOperation data={DEFAULT_HOURS_OF_OPERATION} />
    );
    expect(
      renderedComponent.find('.hoursOfOperation__day--active').length
    ).toEqual(5);
  });

  it('should render 2 day offs given `DEFAULT_HOURS_OF_OPERATION`', () => {
    const renderedComponent = shallow(
      <HoursOfOperation data={DEFAULT_HOURS_OF_OPERATION} />
    );
    expect(
      renderedComponent.find('.hoursOfOperation__day--nonActive').length
    ).toEqual(2);
  });
});
