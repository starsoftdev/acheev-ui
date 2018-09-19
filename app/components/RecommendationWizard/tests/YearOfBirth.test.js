import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import YearOfBirth from 'components/RecommendationWizard/YearOfBirth';

describe('<YearOfBirth />', () => {
  it('should match snapshot', () => {
    const component = create(<YearOfBirth onSelect={() => {}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Should show error', () => {
    const handleSelect = jest.fn();
    const component = shallow(<YearOfBirth onSelect={handleSelect} />);

    component
      .find('Input')
      .first()
      .prop('onChange')('2018');

    component
      .find('Button')
      .first()
      .simulate('click');

    expect(component.state().showMessage).toEqual(true);
    expect(handleSelect).toHaveBeenCalledTimes(0);

    component
      .find('Input')
      .first()
      .prop('onChange')('1885');

    component
      .find('Button')
      .first()
      .simulate('click');

    expect(component.state().showMessage).toEqual(true);
    expect(handleSelect).toHaveBeenCalledTimes(0);
  });

  it('Should call onSelect', () => {
    const handleSelect = jest.fn();
    const component = shallow(<YearOfBirth onSelect={handleSelect} />);

    component
      .find('Input')
      .first()
      .prop('onChange')('1986');

    component
      .find('Button')
      .first()
      .simulate('click');

    expect(component.state().showMessage).toEqual(false);
    expect(handleSelect).toHaveBeenCalledWith('1986');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});
