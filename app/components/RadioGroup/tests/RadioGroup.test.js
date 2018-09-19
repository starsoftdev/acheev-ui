import React from 'react';
import { shallow } from 'enzyme';
import RadioGroup from 'components/RadioGroup';

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
describe('<RadioGroup />', () => {
  it('should apply given className', () => {
    const renderedComponent = shallow(<RadioGroup className="hey" />);
    expect(renderedComponent.find('.hey').length).toEqual(1);
  });

  it('should have correct number of itemClassName containers', () => {
    const renderedComponent = shallow(
      <RadioGroup itemClassName="itemClassHey" options={options} />
    );
    expect(renderedComponent.find('.itemClassHey').length).toEqual(3);
  });

  it('should have correct number of radio buttons', () => {
    const renderedComponent = shallow(<RadioGroup options={options} />);
    expect(renderedComponent.find('input[type="radio"]').length).toEqual(3);
  });

  it('should have proper labels', () => {
    const renderedComponent = shallow(
      <RadioGroup options={options} name="hello" />
    );
    expect(renderedComponent.contains('Option 1')).toEqual(true);
    expect(renderedComponent.contains('Option 2')).toEqual(true);
    expect(renderedComponent.contains('Option 3')).toEqual(true);
  });

  it('should have proper all radio buttons with same name', () => {
    const renderedComponent = shallow(
      <RadioGroup options={options} name="hello" />
    );
    expect(
      renderedComponent.find('input[type="radio"]').get(0).props.name
    ).toEqual('hello');
    expect(
      renderedComponent.find('input[type="radio"]').get(1).props.name
    ).toEqual('hello');
    expect(
      renderedComponent.find('input[type="radio"]').get(2).props.name
    ).toEqual('hello');
  });

  it('should have proper radio button selected by value', () => {
    const renderedComponent = shallow(
      <RadioGroup options={options} name="hello" value="option 2" />
    );
    expect(
      renderedComponent.find('input[type="radio"]').get(0).props.defaultChecked
    ).toEqual(false);
    expect(
      renderedComponent.find('input[type="radio"]').get(1).props.defaultChecked
    ).toEqual(true);
    expect(
      renderedComponent.find('input[type="radio"]').get(2).props.defaultChecked
    ).toEqual(false);
  });

  it('onChange should be fired when Radio Button is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <RadioGroup
        options={options}
        name="hello"
        value="option 2"
        onChange={spy}
      />
    );
    renderedComponent
      .find('input[type="radio"]')
      .first()
      .simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});
