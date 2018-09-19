import React from 'react';
import { shallow } from 'enzyme';
import ButtonGroup, { ButtonGroupItem } from 'components/ButtonGroup';

describe('<ButtonGroup />', () => {
  it('should have correct class from prop `className`', () => {
    const renderedComponent = shallow(<ButtonGroup className="Hello" />);
    expect(renderedComponent.hasClass('Hello')).toEqual(true);
  });
  it('should render correct children', () => {
    const renderedComponent = shallow(
      <ButtonGroup className="Hello">
        <ButtonGroupItem />
      </ButtonGroup>
    );
    expect(renderedComponent.find(ButtonGroupItem).length).toEqual(1);
  });
});
