import React from 'react';
import { shallow } from 'enzyme';
import ConditionTag from 'components/ConditionTag';

describe('<ConditionTag />', () => {
  it('should render name', () => {
    const renderedComponent = shallow(<ConditionTag name="hey" />);
    expect(renderedComponent.contains('hey')).toEqual(true);
  });

  it('calls "removeCondition()" on button click', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(<ConditionTag removeCondition={spy} />);
    renderedComponent.find('.conditionTag__removeButton').simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});
