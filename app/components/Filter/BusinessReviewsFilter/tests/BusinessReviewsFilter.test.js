import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import { create } from 'react-test-renderer';

import BusinessReviewsFilter from 'components/Filter/BusinessReviewsFilter';

describe('<BusinessReviewsFilter />', () => {
  it('should match Snapshot without value', () => {
    const component = create(<BusinessReviewsFilter />);
    expect(component).toMatchSnapshot();
  });

  it('should call onChange with correct data when rating change', () => {
    const handleChange = jest.fn();
    const renderedComponent = shallow(
      <BusinessReviewsFilter value={fromJS({})} onChange={handleChange} />
    );
    renderedComponent.find('CheckboxGroup').prop('onChange')([4, 5]);
    expect(handleChange).toBeCalled();
    expect(handleChange.mock.calls[0][0].toJS()).toMatchObject({
      rating: [4, 5],
    });
  });

  it('should match Snapshot with value', () => {
    const component = create(
      <BusinessReviewsFilter value={fromJS({ rating: [4, 5] })} />
    );
    expect(component).toMatchSnapshot();
  });
});
