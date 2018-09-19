import React from 'react';
import { shallow } from 'enzyme';
import RadioButtonGroup from 'components/RadioButtonGroup';
import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';

const options = [
  {
    label: 'Option 1',
    value: 'option 1',
  },
  {
    label: 'Option 2',
    value: 'option 2',
  },
  {
    label: 'Option 3',
    value: 'option 3',
  },
];
describe('<RadioButtonGroup />', () => {
  it('should have ButtonGroup with given className', () => {
    const renderedComponent = shallow(<RadioButtonGroup className="hey" />);
    expect(renderedComponent.find(ButtonGroup).prop('className')).toEqual(
      'hey'
    );
  });

  it('should have correct number of Buttons', () => {
    const renderedComponent = shallow(<RadioButtonGroup options={options} />);
    expect(renderedComponent.find(Button).length).toEqual(3);
  });

  it('should have proper labels', () => {
    const renderedComponent = shallow(
      <RadioButtonGroup options={options} name="hello" />
    );
    expect(renderedComponent.contains('Option 1')).toEqual(true);
    expect(renderedComponent.contains('Option 2')).toEqual(true);
    expect(renderedComponent.contains('Option 3')).toEqual(true);
  });

  it('should have proper all buttons not selected when no value is provided', () => {
    const renderedComponent = shallow(<RadioButtonGroup options={options} />);
    expect(renderedComponent.find(Button).get(0).props.className).not.toContain(
      'dark'
    );
    expect(renderedComponent.find(Button).get(1).props.className).not.toContain(
      'dark'
    );
    expect(renderedComponent.find(Button).get(2).props.className).not.toContain(
      'dark'
    );
  });

  it('should have proper Button selected by value', () => {
    const renderedComponent = shallow(
      <RadioButtonGroup options={options} selectedButton="option 2" />
    );
    expect(renderedComponent.find(Button).get(0).props.className).not.toContain(
      'dark'
    );
    expect(renderedComponent.find(Button).get(1).props.className).toContain(
      'dark'
    );
    expect(renderedComponent.find(Button).get(2).props.className).not.toContain(
      'dark'
    );
  });

  it('onChange should be fired when Radio Button is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <RadioButtonGroup
        options={options}
        selectedButton="option 2"
        onChange={spy}
      />
    );
    renderedComponent
      .find(Button)
      .first()
      .simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});
