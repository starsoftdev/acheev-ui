import React from 'react';
import { shallow } from 'enzyme';

import Select from 'components/CustomSelect';
import DateRangeSelect from 'components/LP/DateRangeSelect';

const options = [
  {
    label: 'Jan 1, 2014 – Dec 31, 2014',
    from: 'Jan 1, 2014',
    to: 'Dec 31, 2014',
  },
];

describe('<DateRangeSelect />', () => {
  it('onChange should be called when select value is changed', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(<DateRangeSelect onChange={spy} />);
    renderedComponent.find(Select).simulate('change');
    expect(spy).toHaveBeenCalled();
  });

  it('should pass `options` to Select', () => {
    const renderedComponent = shallow(<DateRangeSelect options={options} />);
    expect(renderedComponent.find(Select).prop('options')).toEqual(options);
  });

  it('should pass `value` to Select', () => {
    const renderedComponent = shallow(<DateRangeSelect value={options[0]} />);
    expect(renderedComponent.find(Select).prop('value')).toEqual(options[0]);
  });
});
