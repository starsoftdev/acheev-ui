import React from 'react';
import { shallow, render } from 'enzyme';
import Checkbox from 'components/Checkbox';
import { Field } from 'react-formal';

describe('<Checkbox />', () => {
  it('should be disabled if `disabled` prop is provided', () => {
    const renderedComponent = render(<Checkbox element="Checkbox" disabled />);
    expect(renderedComponent.find('Checkbox').prop('disabled')).toEqual(true);
  });

  it('should apply type to Checkbox', () => {
    const renderedComponent = shallow(
      <Checkbox element="Checkbox" type="submit" />
    );
    expect(renderedComponent.find('Checkbox').prop('type')).toEqual('submit');
  });

  it(`should render react-formal's Field if element={Field}`, () => {
    const renderedComponent = shallow(<Checkbox element={Field} name="hey" />);
    expect(renderedComponent.find(Field).length).toEqual(1);
  });

  it(`should apply type to rendered input`, () => {
    const renderedComponent = shallow(<Checkbox type="checkbox" />);
    expect(renderedComponent.find('input').prop('type')).toEqual('checkbox');
  });

  it(`should apply specified id to checkbox and label`, () => {
    const renderedComponent = render(<Checkbox id="hey" />);
    expect(renderedComponent.find('input').prop('id')).toEqual('hey');
    expect(renderedComponent.find('label').prop('for')).toEqual('hey');
  });

  it(`should render clickableText`, () => {
    const renderedComponent = shallow(<Checkbox clickableText="hey" />);
    expect(renderedComponent.contains('hey')).toEqual(true);
  });

  it('should render its children', () => {
    const renderedComponent = shallow(<Checkbox>hey ho</Checkbox>);
    expect(renderedComponent.text()).toEqual('hey ho');
  });

  it('should apply given className', () => {
    const renderedComponent = shallow(<Checkbox className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });
});
