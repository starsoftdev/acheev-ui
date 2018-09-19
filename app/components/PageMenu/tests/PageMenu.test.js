import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import PageMenu from 'components/PageMenu';
import MobileDropdownMenu from 'components/PageMenu/MobileDropdownMenu';

const data = fromJS({});
const location = {};

describe('<PageMenu />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<PageMenu />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it("shouldn't throw error if location is not specified", () => {
    try {
      shallow(<PageMenu data={data} />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should pass "Section" as `dropdownLabel` if not provided', () => {
    const renderedComponent = shallow(
      <PageMenu data={data} location={location} />
    );
    expect(
      renderedComponent.find(MobileDropdownMenu).prop('dropdownLabel')
    ).toEqual('Section');
  });

  it('should apply given className', () => {
    const renderedComponent = shallow(
      <PageMenu data={data} location={location} className="hey" />
    );
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });
});
