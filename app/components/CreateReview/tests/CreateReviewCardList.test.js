import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import CreateReviewCardList from 'components/CreateReview/CardList';
import BorderedTitle from 'components/BorderedTitle';
import CreateReviewCard from 'components/CreateReview/Card';

const products = fromJS([
  {
    name: 'test',
    business: {
      name: 'test business',
    },
    __t: 'strain',
  },
  {
    name: 'sample',
    business: {
      name: 'test business',
    },
    __t: 'strain',
  },
]);

describe('<CreateReviewCardList />', () => {
  it('should does not render components when products prop is empty', () => {
    const renderedComponent = shallow(<CreateReviewCardList />);
    expect(renderedComponent.find(BorderedTitle).length).toEqual(0);
    expect(renderedComponent.find(CreateReviewCard).length).toEqual(0);
  });

  it('should render BorderedTitle', () => {
    const renderedComponent = shallow(
      <CreateReviewCardList products={products} />
    );
    expect(renderedComponent.find(BorderedTitle).length).toEqual(1);
  });

  it('should render same number of CreateReviewCard as products length', () => {
    const renderedComponent = shallow(
      <CreateReviewCardList products={products} />
    );
    expect(renderedComponent.find(CreateReviewCard).length).toEqual(2);
  });
});
