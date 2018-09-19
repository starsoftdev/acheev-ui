import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import DEFAULT_HOURS_OF_OPERATION from 'enum/HoursOfOperation';

import ExpandHourList from 'components/ExpandHourList';

const data = fromJS(DEFAULT_HOURS_OF_OPERATION);

describe('<ExpandHourList />', () => {
  it("shouldn't throw error if no props are specified", () => {
    try {
      shallow(<ExpandHourList />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('dropdown should be hidden by default', () => {
    const renderedComponent = shallow(<ExpandHourList data={data} />);
    expect(renderedComponent.find('.expandHourList__dropdown').length).toEqual(
      0
    );
  });

  it('should render dropdown when labelWrapper is clicked', () => {
    const renderedComponent = shallow(<ExpandHourList data={data} />);
    renderedComponent
      .find('.expandHourList__labelWrapper')
      .simulate('click', { stopPropagation: () => {} });
    expect(renderedComponent.find('.expandHourList__dropdown').length).toEqual(
      1
    );
  });

  it('should be open', () => {
    const component = create(
      <ExpandHourList date="2017-12-07T16:47-05:00" data={data} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should be closed', () => {
    const component = create(
      <ExpandHourList date="2017-12-07T17:01-05:00" data={data} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
