import React from 'react';
import { mount } from 'enzyme';
import { fromJS } from 'immutable';
import { create } from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import FeatureList from 'components/FeatureList';

import ProducerIcon from 'images/sprite/producer.svg';
import ReviewIcon from 'images/sprite/review.svg';
import StrainIcon from 'images/sprite/strain.svg';

const data = fromJS([
  {
    icon: StrainIcon,
    content: 'find a strain',
    linkTo: 'strains',
  },
  {
    icon: ProducerIcon,
    content: 'find a producer',
    linkTo: 'producers',
  },
  {
    icon: ReviewIcon,
    content: 'Leave reviews & earn Points',
    linkTo: 'rewards',
  },
]);

describe('<FeatureList />', () => {
  it('should apply className prop', () => {
    const renderedComponent = mount(
      <MemoryRouter>
        <FeatureList className="hey" />
      </MemoryRouter>
    );
    expect(renderedComponent.find('.featureList').hasClass('hey')).toEqual(
      true
    );
  });

  it('renders default feature list if data is not provided', () => {
    const component = create(
      <MemoryRouter>
        <FeatureList />
      </MemoryRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders data if provided', () => {
    const component = create(
      <MemoryRouter>
        <FeatureList data={data} />
      </MemoryRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
