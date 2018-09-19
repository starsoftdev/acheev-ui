import React from 'react';
import { shallow } from 'enzyme';

import CreateReview from 'components/CreateReview';
import SearchField from 'components/SearchField';
import Pagination from 'components/Pagination';
import Preloader from 'components/Preloader';
import CreateReviewCardList from 'components/CreateReview/CardList';

describe('<CreateReview />', () => {
  it('should render SearchField', () => {
    const renderedComponent = shallow(<CreateReview />);
    expect(renderedComponent.find(SearchField).length).toEqual(1);
  });

  it('should render Pagination', () => {
    const renderedComponent = shallow(<CreateReview />);
    expect(renderedComponent.find(Pagination).length).toEqual(1);
  });

  it('should render Preloader when loading data', () => {
    const renderedComponent = shallow(<CreateReview isLoading />);
    expect(renderedComponent.find(Preloader).length).toEqual(1);
  });

  it('should render CreateReviewCardList unless loading data', () => {
    const renderedComponent = shallow(<CreateReview isLoading={false} />);
    expect(renderedComponent.find(CreateReviewCardList).length).toEqual(1);
  });
});
