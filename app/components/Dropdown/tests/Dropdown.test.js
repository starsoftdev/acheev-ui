import React from 'react';
import { shallow } from 'enzyme';

import Dropdown from 'components/Dropdown';

describe('<Dropdown />', () => {
  it('should render children', () => {
    const renderedComponent = shallow(<Dropdown>Hey</Dropdown>);
    expect(renderedComponent.contains('Hey')).toEqual(true);
  });

  it('should render dropdownContent', () => {
    const renderedComponent = shallow(<Dropdown dropdownContent="Hey" />);
    renderedComponent
      .find('.dropdown__toggle')
      .simulate('click', { stopPropagation: () => {} });
    expect(renderedComponent.contains('Hey')).toEqual(true);
  });
});
