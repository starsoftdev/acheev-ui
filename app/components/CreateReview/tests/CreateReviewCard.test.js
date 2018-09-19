import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import CreateReviewCard from 'components/CreateReview/Card';
import Link from 'components/Link';

const strainData = fromJS({
  name: 'Test',
  slug: 'test',
  business: {
    name: 'test business',
  },
  __t: 'strain',
});

const productData = fromJS({
  name: 'Test',
  slug: 'test',
  business: {
    name: 'test business',
  },
});

describe('<CreateReviewCard />', () => {
  it("shouldn't throw error if product data is not specified", () => {
    try {
      shallow(<CreateReviewCard />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should render correct strain Link', () => {
    const renderedComponent = shallow(
      <CreateReviewCard product={strainData} />
    );
    expect(renderedComponent.find(Link).prop('to')).toEqual(
      '/strains/test/create-review'
    );
  });

  it('should render correct product Link', () => {
    const renderedComponent = shallow(
      <CreateReviewCard product={productData} />
    );
    expect(renderedComponent.find(Link).prop('to')).toEqual(
      '/accessories/test/create-review'
    );
  });

  it('should render correct name and business name', () => {
    const renderedComponent = shallow(
      <CreateReviewCard product={strainData} />
    );
    expect(renderedComponent.contains('Test')).toEqual(true);
    expect(renderedComponent.contains('test business')).toEqual(true);
  });
});
