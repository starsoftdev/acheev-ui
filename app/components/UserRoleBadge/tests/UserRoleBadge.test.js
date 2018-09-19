import React from 'react';
import { shallow } from 'enzyme';
import UserRoleBadge from 'components/UserRoleBadge';

describe('<UserRoleBadge />', () => {
  it('should render correct business role', () => {
    const renderedComponent = shallow(<UserRoleBadge role="business" />);
    expect(
      renderedComponent.hasClass('userRoleBadge userRoleBadge--business')
    ).toEqual(true);
  });
});
