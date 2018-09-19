import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import { MemoryRouter } from 'react-router-dom';

import BusinessCard from 'components/BusinessCard';
import ReviewCount from 'components/ReviewCount';

const data = fromJS({
  name: 'Tweed',
  slug: 'tweed',
  thumbnail: 'https://lift.co/uploads/v6AIjoUMF7ozJw4UWzgF.png',
  __t: 'Producer',
  reviews: ['5980b8660952e830dce85e20', '5980b8660952e830dce85e0e'],
  rating: 4,
});

jest.mock('react-dotdotdot', () => 'div');
jest.mock('react-rating', () => 'div');

describe('<BusinessCard />', () => {
  it('should hide ReviewCount if hideReview={true}', () => {
    const renderedComponent = shallow(
      <MemoryRouter>
        <BusinessCard data={data} hideReview />
      </MemoryRouter>
    );
    expect(renderedComponent.contains(<ReviewCount />)).toEqual(false);
  });

  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(
        <MemoryRouter>
          <BusinessCard />
        </MemoryRouter>
      );
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('renders data if provided', () => {
    const component = create(
      <MemoryRouter>
        <BusinessCard data={data} />
      </MemoryRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
