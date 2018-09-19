import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import MobileDropdownMenu from 'components/PageMenu/MobileDropdownMenu';
import DropdownMenu from 'components/DropdownMenu';

const data = fromJS([{}]);
const location = {};

describe('<MobileDropdownMenu />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<MobileDropdownMenu />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it("shouldn't throw error if location is not specified", () => {
    try {
      shallow(<MobileDropdownMenu data={data} />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should pass given className to `DropdownMenu`', () => {
    const renderedComponent = shallow(
      <MobileDropdownMenu data={data} location={location} className="hey" />
    );
    expect(renderedComponent.find(DropdownMenu).prop('className')).toContain(
      'hey'
    );
  });
});
