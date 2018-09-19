import React from 'react';
import { shallow } from 'enzyme';
import Cannabinoids from 'components/Cannabinoids';

describe('<Cannabinoids />', () => {
  it('should return `null` if both `thc` and `cbd` props are not specified', () => {
    const renderedComponent = shallow(<Cannabinoids />);
    expect(renderedComponent.type()).toEqual(null);
  });

  it('should apply given className', () => {
    const renderedComponent = shallow(
      <Cannabinoids className="hey" thc="99" />
    );
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should render THC', () => {
    const renderedComponent = shallow(<Cannabinoids thc="99" category="Oil" />);
    expect(renderedComponent.contains('99 mg/ml')).toEqual(true);
  });

  it('should render CBD', () => {
    const renderedComponent = shallow(
      <Cannabinoids cbd="99" category="Strain" />
    );
    expect(renderedComponent.contains('99%')).toEqual(true);
  });
});
