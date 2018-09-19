import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import DropdownMenu from 'components/PageMenu/DropdownMenu';

const data = fromJS([{}]);
const location = {};

describe('<DropdownMenu />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<DropdownMenu />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it("shouldn't throw error if location is not specified", () => {
    try {
      shallow(<DropdownMenu data={data} />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should apply given className', () => {
    const renderedComponent = shallow(
      <DropdownMenu data={data} location={location} className="hey" />
    );
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });
});
