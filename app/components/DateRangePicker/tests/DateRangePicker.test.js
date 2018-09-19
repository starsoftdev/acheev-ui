import React from 'react';
import { shallow } from 'enzyme';
import Datepicker from 'components/ReactDatepicker';
import moment from 'moment';

import DateRangePicker from 'components/DateRangePicker';

const date = moment('21.02.2018');

describe('<DateRangePicker />', () => {
  it('onChangeFrom should be called when first Datepicker is changed', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(<DateRangePicker onChangeFrom={spy} />);
    renderedComponent
      .find(Datepicker)
      .at(0)
      .simulate('change');
    expect(spy).toHaveBeenCalled();
  });

  it('onChangeFrom should be called when first Datepicker is changed', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(<DateRangePicker onChangeTo={spy} />);
    renderedComponent
      .find(Datepicker)
      .at(1)
      .simulate('change');
    expect(spy).toHaveBeenCalled();
  });

  it('should pass `from` to first Datepicker', () => {
    const renderedComponent = shallow(<DateRangePicker from={date} />);
    expect(
      renderedComponent
        .find(Datepicker)
        .at(0)
        .prop('selected')
    ).toEqual(date);
  });

  it('should pass `to` to second Datepicker', () => {
    const renderedComponent = shallow(<DateRangePicker to={date} />);
    expect(
      renderedComponent
        .find(Datepicker)
        .at(1)
        .prop('selected')
    ).toEqual(date);
  });
});
