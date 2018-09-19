import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import CannabisProductReviewForm from 'components/CannabisProductReviewForm';

const currentUser = fromJS({});

describe('<CannabisProductReviewForm />', () => {
  it("shouldn't throw error if no props are specified", () => {
    try {
      shallow(<CannabisProductReviewForm />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it("shouldn't render Buy Section if shopifyProduct is not specified", () => {
    const renderedComponent = shallow(<CannabisProductReviewForm />);
    expect(
      renderedComponent.find('.CannabisProductReviewForm__buySection').length
    ).toEqual(0);
  });

  it('completeReviewForm should be fired when `.cannabisProductReviewForm__title` input has been changed', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <CannabisProductReviewForm completeReviewForm={spy} />
    );
    renderedComponent
      .find('.cannabisProductReviewForm__title')
      .simulate('change');
    expect(spy).toHaveBeenCalled();
  });

  it('clearReviewForm should be fired when component unmounts', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <CannabisProductReviewForm clearReviewForm={spy} />
    );
    renderedComponent.unmount();
    expect(spy).toHaveBeenCalled();
  });

  it('removePhoto should be fired when `cannabisProductReviewForm__toggleIcon` is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <CannabisProductReviewForm removePhoto={spy} />
    );
    renderedComponent.setState({ uploadedFiles: [{ progress: 100 }] });
    renderedComponent
      .find('.cannabisProductReviewForm__toggleIcon')
      .simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should render errorMessage', () => {
    const renderedComponent = shallow(
      <CannabisProductReviewForm errorMessage="Hey" />
    );
    expect(renderedComponent.contains('Hey')).toEqual(true);
  });

  it('should render loading button if `isLoding` prop is specified', () => {
    const renderedComponent = shallow(
      <CannabisProductReviewForm currentUser={currentUser} isLoading />
    );
    expect(
      renderedComponent
        .find('.cannabisProductReviewForm__submitButton')
        .prop('isLoading')
    ).toEqual(true);
  });

  it("shouldn't require auth to submit the form when currentUser is specified", () => {
    const renderedComponent = shallow(
      <CannabisProductReviewForm currentUser={currentUser} />
    );
    expect(renderedComponent.find('RequireAuth').length).toEqual(0);
  });

  it('should require auth to submit the form when currentUser is not specified', () => {
    const renderedComponent = shallow(<CannabisProductReviewForm />);
    expect(renderedComponent.find('RequireAuth').length).toEqual(1);
  });
});
