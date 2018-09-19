import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import Experience from 'components/RecommendationWizard/Experience';

describe('<Experience />', () => {
  it('should match snapshot', () => {
    const component = create(<Experience onSelect={() => {}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Should call onSelect', () => {
    const handleSelect = jest.fn();
    const component = shallow(<Experience onSelect={handleSelect} />);

    component
      .find('Block')
      .first()
      .simulate('click', { currentTarget: { dataset: { name: 'new' } } });

    expect(handleSelect).toHaveBeenCalledWith('new');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});
