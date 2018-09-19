import React from 'react';
import { shallow } from 'enzyme';

import LineChart from 'components/LineChart';

const emptyData = [];

describe('<LineChart />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<LineChart />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('renders default message if empty array is provided', () => {
    const component = shallow(<LineChart data={emptyData} />);
    expect(
      component.contains("You don't have any reviews for selected period")
    ).toEqual(true);
  });

  it('renders `message` if provided', () => {
    const component = shallow(<LineChart data={emptyData} message="Hey" />);
    expect(component.contains('Hey')).toEqual(true);
  });
});
