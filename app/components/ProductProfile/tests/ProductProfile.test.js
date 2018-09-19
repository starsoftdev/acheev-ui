import React from 'react';
import { shallow, mount } from 'enzyme';
import { fromJS } from 'immutable';
import { create } from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import ProductProfile from 'components/ProductProfile';
import Button from 'components/Button';

const data = fromJS({
  business: {
    photos: ['https://lift.co/uploads/tLrXUeWNTn1Gq72YtE4d.jpg'],
    hoursOfOperation: [],
    telephone: '1 (855) 558-9333',
    admins: [6266],
    facebook: 'https://www.facebook.com/bedrocancanada',
    createdOn: '2014-12-11T05:06:00.253Z',
    productReviewCount: 1474,
    name: 'Bedrocan',
    slug: 'bedrocan',
    thumbnail: 'https://lift.co/uploads/tLrXUeWNTn1Gq72YtE4d.jpg',
    productRating: 4.5,
    published: true,
    registrationLink: 'https://www.tweedmainstreet.com/account/register',
    twitter: 'https://twitter.com/bedrocancda',
    __t: 'Producer',
    __v: 4,
    reviewCount: 348,
    tags: [],
    _id: '54892638f2c99094235ef27a',
    updatedOn: '2017-08-01T17:19:24.329Z',
    reviews: ['5980b8660952e830dce85c4d', '5980b8660952e830dce85afe'],
    website: 'http://bedrocan.ca',
    id: '54892638f2c99094235ef27a',
    email: 'info@bedrocan.ca',
    description:
      '<p>In 2011, Bedrocan BV, a Dutch company, was invited to Ottawa by Health Canada to comment on Canada’s new regulations for medicinal cannabis, the Marijuana for Medical Purposes Regulations (MMPR).</p>',
    features: {
      promoted: false,
      points: true,
    },
    rating: 4.5,
    linkedin: 'https://www.linkedin.com/company/bedrocan-canada',
    locations: [
      {
        province: 'Ontario',
        city: 'Toronto',
        address: 'PO BOX 89589, 250A Eglinton Ave. East',
        postalCode: 'M4P 1K2',
        _id: '5980b81c0952e830dce61524',
        latLon: [43.7084593, -79.39065719999996],
      },
    ],
  },
  photos: [],
  flavours: [],
  thcLow: 22,
  cbd: null,
  createdOn: '2014-10-01T02:46:14.198Z',
  cbdHigh: null,
  positiveEffects: [],
  symptoms: [],
  name: 'Bedrocan®',
  slug: 'bedrocan-bedrocan',
  negativeEffects: [],
  variants: [
    {
      price: 850,
      doseUnit: 'g',
      doseAmount: 1,
      _id: '5980b81e0952e830dce61863',
      weightUnit: 'g',
      availabilityStatus: 'available',
      available: true,
    },
  ],
  published: true,
  thc: '22%',
  cbdLow: null,
  thcHigh: 22,
  searchField: 'Bedrocan® Bedrocan hybrid',
  prescribedFor: [],
  __t: 'Strain',
  __v: 1,
  awards: [],
  reviewCount: 611,
  title: 'Bedrocan®',
  tags: [],
  _id: '5980b81e0952e830dce61862',
  updatedOn: '2017-05-25T23:25:32.987Z',
  reviews: ['5980b8200952e830dce621be', '5980b8200952e830dce622c4'],
  id: '5980b81e0952e830dce61862',
  milled: false,
  description:
    '<p>Bedrocan® variety is a ‘Sativa’ dominant strain of cannabis characterized by 22% THC and less than 1% CBD (content by weight).</p><p>Bedrocan® was developed in the Netherlands out of a requirement by the Dutch Health Ministry to have a “high THC” variety available to patients. It’s a Sativa plant type, bred because of its high yield, optimal growth characteristics, and derived from the popularly known “Jack Herer” cannabis variety.</p>',
  rating: 4.5,
  category: 'hybrid',
});

const follows = fromJS({
  count: 47,
  isLoading: false,
  error: '',
});
const likes = fromJS({
  count: 52,
  isLoading: false,
  error: '',
});
const product = {
  options: [{ name: 'hey', values: ['hey', 'ho'] }],
};

jest.mock('react-rating', () => 'div');

describe('<ProductProfile />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(
        <MemoryRouter>
          <ProductProfile />
        </MemoryRouter>
      );
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it("shouldn't throw error if data is specified but follows or likes are not specified", () => {
    try {
      shallow(
        <MemoryRouter>
          <ProductProfile data={data} />
        </MemoryRouter>
      );
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it("shouldn't render Buy Section if shopifyProduct is not specified", () => {
    const renderedComponent = shallow(
      <MemoryRouter>
        <ProductProfile data={data} follows={follows} likes={likes} />
      </MemoryRouter>
    );
    expect(
      renderedComponent.find('.ProductProfile__buySection').length
    ).toEqual(0);
  });

  it('addToCart should be fired when Button is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = mount(
      <MemoryRouter>
        <ProductProfile
          addToCart={spy}
          data={data}
          follows={follows}
          likes={likes}
          shopifyProduct={product}
        />
      </MemoryRouter>
    );
    renderedComponent.find(Button).simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('followLikeProduct should be fired when ProductAction is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = mount(
      <MemoryRouter>
        <ProductProfile data={data} currentUser={{}} followLikeProduct={spy} />
      </MemoryRouter>
    );
    renderedComponent
      .find('ProductAction')
      .first()
      .simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it("shouldn't require auth to follow or like the product when currentUser is specified", () => {
    const renderedComponent = mount(
      <MemoryRouter>
        <ProductProfile data={data} currentUser={{}} />
      </MemoryRouter>
    );
    expect(renderedComponent.find('RequireAuth').length).toEqual(0);
  });

  it('should require auth to follow or like the product when currentUser is not specified', () => {
    const renderedComponent = mount(
      <MemoryRouter>
        <ProductProfile data={data} />
      </MemoryRouter>
    );
    expect(renderedComponent.find('RequireAuth').length).toEqual(2);
  });

  it('renders data if provided', () => {
    const component = create(
      <MemoryRouter>
        <ProductProfile
          data={data}
          follows={follows}
          likes={likes}
          shopifyProduct={product}
        />
      </MemoryRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
