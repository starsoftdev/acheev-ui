import React from 'react';
import { shallow } from 'enzyme';

import Header from 'components/LP/TitleHeader';

describe('<Header />', () => {
  it('should render title', () => {
    const renderedComponent = shallow(<Header title="Hey" />);
    expect(renderedComponent.contains('Hey')).toEqual(true);
  });
  it('should render children', () => {
    const renderedComponent = shallow(<Header title="Hey">Hooray!</Header>);
    expect(renderedComponent.contains('Hooray!')).toEqual(true);
  });
});
