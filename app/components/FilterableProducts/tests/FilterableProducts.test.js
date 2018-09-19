import React from 'react';
import { shallow, mount } from 'enzyme';
import { fromJS } from 'immutable';
import { create } from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import FilterableProducts from 'components/FilterableProducts';

const data = fromJS({
  url: 'Strain',
  filters: [
    {
      index: 0,
      name: 'Most popular',
      sort: '-reviewCount',
      items: [
        {
          business: {
            photos: [],
            hoursOfOperation: [],
            telephone: '1-855-55-TWEED(89333)',
            admins: [6267],
            facebook: 'https://www.facebook.com/tweedinc',
            createdOn: '2014-12-11T05:06:00.238Z',
            productReviewCount: 7652,
            name: 'Tweed',
            slug: 'tweed',
            thumbnail: 'https://lift.co/uploads/v6AIjoUMF7ozJw4UWzgF.png',
            productRating: 4,
            published: true,
            registrationLink: 'http://www.tweed.com/account/register',
            twitter: 'https://twitter.com/tweedinc',
            __t: 'Producer',
            __v: 0,
            reviewCount: 2599,
            tags: [],
            _id: '54892638f2c99094235ef273',
            updatedOn: '2017-08-01T17:19:24.354Z',
            reviews: ['5980b8660952e830dce85e20', '5980b8660952e830dce85e0e'],
            website: 'http://tweed.com',
            id: '54892638f2c99094235ef273',
            email: 'hi@tweed.com',
            description:
              '<p>Tweed is a Canadian company established to supply an unmatched selection of premium medical marijuana to treat symptoms such as chronic pain, seizures, muscle spasms, nausea and loss of appetite. We believe in providing only reliable, high quality products, and strive to do so with the utmost empathy, compassion, professionalism and integrity.</p>',
            features: {
              promoted: false,
              points: true,
            },
            rating: 4,
            fax: '1-888-977-2595',
            linkedin: 'https://www.linkedin.com/company/tweed-inc-',
            locations: [
              {
                province: 'Ontario',
                city: 'Smiths Falls',
                address: '1 Hershey Dr',
                postalCode: 'K7A 0A8',
                _id: '5980b81c0952e830dce6152c',
                latLon: [44.8997225, -76.00185320000003],
              },
            ],
          },
          photos: [],
          flavours: [],
          thcLow: 8.04,
          cbd: '5.93%',
          createdOn: '2015-05-13T21:42:12.154Z',
          cbdHigh: 5.93,
          positiveEffects: [],
          symptoms: [],
          name: 'Penelope',
          slug: 'tweed-penelope',
          negativeEffects: [],
          variants: [
            {
              price: 900,
              doseUnit: 'g',
              doseAmount: 1,
              _id: '5980b81e0952e830dce618fb',
              weightUnit: 'g',
              availabilityStatus: 'available',
              available: true,
            },
          ],
          published: true,
          thc: '8.04%',
          cbdLow: 5.93,
          thcHigh: 8.04,
          searchField: 'Penelope Tweed hybrid',
          prescribedFor: [],
          __t: 'Strain',
          awards: [],
          reviewCount: 542,
          title: 'Penelope',
          tags: [],
          _id: '5980b81e0952e830dce618fa',
          updatedOn: '2017-05-25T23:25:32.874Z',
          reviews: ['5980b8200952e830dce61dbe', '5980b8200952e830dce61ec0'],
          id: '5980b81e0952e830dce618fa',
          milled: false,
          description: '<p><span>CBD Skunk Haze</span></p><p><br/></p>',
          rating: 3.5,
          category: 'hybrid',
        },
      ],
    },
    {
      index: 1,
      name: 'Trending',
      sort: '-rating,-createdOn',
      items: null,
    },
    {
      index: 2,
      name: 'New',
      sort: '-createdOn',
      items: null,
    },
  ],
  isLoading: false,
  active: 0,
});

jest.mock('react-dotdotdot', () => 'div');
jest.mock('react-rating', () => 'div');
jest.mock('react-slick', () => 'div');
// eslint-disable-next-line no-global-assign
console = {
  log: jest.fn(),
  error: jest.fn(),
};

describe('<FilterableProducts />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(
        <MemoryRouter>
          <FilterableProducts />
        </MemoryRouter>
      );
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('addToCart should be fired when Button is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = mount(
      <MemoryRouter>
        <FilterableProducts requestItems={spy} data={data} />
      </MemoryRouter>
    );
    renderedComponent
      .find('ButtonGroupItem')
      .first()
      .simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should render Link with appropriate `to` prop when `linksTo` prop is specified', () => {
    const renderedComponent = mount(
      <MemoryRouter>
        <FilterableProducts data={data} linksTo="/hey" />
      </MemoryRouter>
    );
    expect(
      renderedComponent
        .find('Link')
        .at(0)
        .prop('to')
    ).toEqual('/hey');
    expect(
      renderedComponent
        .find('Link')
        .at(1)
        .prop('to')
    ).toEqual('/hey');
  });

  it('should render category if category prop is specified', () => {
    const renderedComponent = mount(
      <MemoryRouter>
        <FilterableProducts data={data} category="Hey" />
      </MemoryRouter>
    );
    expect(renderedComponent.text()).toContain('Hey');
  });

  it('should add className `bb-light-gray` to `.filterableProducts__item` if `border` prop is specified', () => {
    const renderedComponent = mount(
      <MemoryRouter>
        <FilterableProducts data={data} border />
      </MemoryRouter>
    );
    expect(
      renderedComponent
        .find('.filterableProducts__item')
        .hasClass('bb-light-gray')
    ).toEqual(true);
  });

  it('renders data if provided', () => {
    const component = create(
      <MemoryRouter>
        <FilterableProducts data={data} />
      </MemoryRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
