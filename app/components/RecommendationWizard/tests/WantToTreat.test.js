import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import WantToTreat from 'components/RecommendationWizard/WantToTreat';

describe('<WantToTreat />', () => {
  it('should match snapshot', () => {
    const component = create(<WantToTreat onSelect={() => {}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Should show error', () => {
    const handleSelect = jest.fn();
    const component = shallow(<WantToTreat onSelect={handleSelect} />);
    component.find('Button').simulate('click');
    expect(component.state().showMessage).toEqual(true);
    expect(handleSelect).toHaveBeenCalledTimes(0);
  });

  it('Should call onSelect', () => {
    const handleSelect = jest.fn();
    const component = shallow(<WantToTreat onSelect={handleSelect} />);
    component
      .find('Block')
      .first()
      .simulate('click', { currentTarget: { dataset: { name: 'pain' } } });
    component.find('Button').simulate('click');
    expect(component.state().showMessage).toEqual(false);
    expect(handleSelect).toHaveBeenCalledWith(['pain']);
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});
