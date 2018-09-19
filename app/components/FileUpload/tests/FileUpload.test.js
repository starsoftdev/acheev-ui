import React from 'react';
import { shallow, mount } from 'enzyme';
import FileUpload from 'components/FileUpload';

jest.mock('react-formal', () => ({
  Field: 'div',
}));

jest.mock('../../ValidationMessage', () => 'div');

const picture = 'http://example.com/pic.jpg';

describe('<FileUpload />', () => {
  it('uploadPhoto should be called when input is changed', () => {
    const spy = jest.fn();
    const renderedComponent = mount(<FileUpload uploadFunction={spy} />);
    renderedComponent
      .find('input')
      .simulate('change', { preventDefault: () => {} });
    expect(spy).toHaveBeenCalled();
  });

  it('should display provided picture', () => {
    const renderedComponent = shallow(<FileUpload picture={picture} />);
    expect(
      renderedComponent.find('.fileUpload__image').prop('style').backgroundImage
    ).toContain(picture);
  });

  it('should display provided `buttonText`', () => {
    const renderedComponent = shallow(<FileUpload buttonText="hey" />);
    expect(renderedComponent.find('Button').contains('hey')).toBe(true);
  });

  it('should display default buttonText if not provided', () => {
    const renderedComponent = shallow(<FileUpload />);
    expect(
      renderedComponent.find('Button').contains('Upload New Picture')
    ).toBe(true);
  });
});
