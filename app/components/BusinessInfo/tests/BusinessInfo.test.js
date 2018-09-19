import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import { MemoryRouter } from 'react-router-dom';

import BusinessInfo from 'components/BusinessInfo';

const data = fromJS({
  name: 'Tweed',
  slug: 'tweed',
  thumbnail: 'https://lift.co/uploads/v6AIjoUMF7ozJw4UWzgF.png',
  __t: 'Producer',
  reviews: ['5980b8660952e830dce85e20', '5980b8660952e830dce85e0e'],
  admins: [],
  rating: 4,
});

jest.mock('react-dotdotdot', () => 'div');
jest.mock('react-rating', () => 'div');

describe('<BusinessInfo />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(
        <MemoryRouter>
          <BusinessInfo />
        </MemoryRouter>
      );
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('renders data if provided', () => {
    const component = create(
      <MemoryRouter>
        <BusinessInfo
          category="producers"
          data={data}
          slug="tweed"
          follows={fromJS({})}
          likes={fromJS({})}
        />
      </MemoryRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
