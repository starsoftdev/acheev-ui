import React from 'react';
import { shallow } from 'enzyme';
import TextAreaField from 'components/TextAreaField';
import { Field } from 'react-formal';

describe('<TextAreaField />', () => {
  it('should have correct class name from `className` props', () => {
    const renderedComponent = shallow(
      <TextAreaField name="hey" className="hey" />
    );
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should have Field component with correct props', () => {
    const renderedComponent = shallow(
      <TextAreaField name="hey" id="hello" rows={2} />
    );
    expect(renderedComponent.find(Field).prop('name')).toEqual('hey');
    expect(renderedComponent.find(Field).prop('id')).toEqual('hello');
    expect(renderedComponent.find(Field).prop('rows')).toEqual(2);
  });

  it('onChange should be fired', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <TextAreaField name="hey" id="hello" rows={2} onChange={spy} />
    );
    renderedComponent.find(Field).simulate('change');
    expect(spy).toHaveBeenCalled();
  });

  it('onFocus should be fired', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <TextAreaField name="hey" id="hello" rows={2} onFocus={spy} />
    );
    renderedComponent.find(Field).simulate('focus');
    expect(spy).toHaveBeenCalled();
  });

  it('onBlur should be fired', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <TextAreaField name="hey" id="hello" rows={2} onBlur={spy} />
    );
    renderedComponent.find(Field).simulate('blur');
    expect(spy).toHaveBeenCalled();
  });
});
