import React from 'react';
import { shallow, mount } from 'enzyme';
import Input from 'components/Input';

describe('<Input />', () => {
  it('should have date type if provided', () => {
    const renderedComponent = shallow(<Input type="date" />);
    expect(renderedComponent.find('input').prop('type')).toEqual('date');
  });

  it('should render textarea if element="textarea"', () => {
    const renderedComponent = shallow(<Input element="textarea" />);
    expect(renderedComponent.find('textarea').length).toEqual(1);
  });

  it('should pass autoFocus prop to rendered input', () => {
    const renderedComponent = shallow(<Input autoFocus />);
    expect(renderedComponent.find('input').prop('autoFocus')).toEqual(true);
  });

  it("instance prop returns input's instance", () => {
    let inputInstance;
    const renderedComponent = mount(
      <Input
        instance={el => {
          inputInstance = el;
          return null;
        }}
      />
    );
    expect(renderedComponent.find('input').instance()).toEqual(inputInstance);
  });
});
