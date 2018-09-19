import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import Gender from 'components/RecommendationWizard/Gender';

describe('<Gender />', () => {
  it('should match snapshot', () => {
    const component = create(<Gender onSelect={() => {}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Should call onSelect', () => {
    const handleSelect = jest.fn();
    const component = shallow(<Gender onSelect={handleSelect} />);

    component
      .find('Block')
      .first()
      .simulate('click', { currentTarget: { dataset: { name: 'new' } } });

    expect(handleSelect).toHaveBeenCalledWith('new');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});
