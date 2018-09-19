import React from 'react';
import { shallow } from 'enzyme';
import { ButtonGroupItem } from 'components/ButtonGroup';

describe('<ButtonGroupItem />', () => {
  it('should have correct class from prop `className`', () => {
    const renderedComponent = shallow(<ButtonGroupItem className="Hello" />);
    expect(renderedComponent.hasClass('Hello')).toEqual(true);
  });
  it('should have `light hollow` class if active is set to `false`', () => {
    const renderedComponent = shallow(<ButtonGroupItem className="Hello" />);
    expect(renderedComponent.hasClass('light hollow')).toEqual(true);
  });
  it('should have `active` class if active is set to `true`', () => {
    const renderedComponent = shallow(
      <ButtonGroupItem className="Hello" active>
        Hello Button
      </ButtonGroupItem>
    );
    expect(renderedComponent.hasClass('active')).toEqual(true);
  });
  it('should render correct children', () => {
    const renderedComponent = shallow(
      <ButtonGroupItem className="Hello">Hello Button</ButtonGroupItem>
    );
    expect(renderedComponent.contains('Hello Button')).toEqual(true);
  });
});
