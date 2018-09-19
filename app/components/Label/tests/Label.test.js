import React from 'react';
import { shallow } from 'enzyme';
import Label from 'components/Label';
import Link from 'components/Link';

describe('<Label />', () => {
  it('should render its children', () => {
    const renderedComponent = shallow(<Label>hey ho</Label>);
    expect(renderedComponent.text()).toEqual('hey ho');
  });

  it('should apply given className', () => {
    const renderedComponent = shallow(<Label className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should apply `label--hasArrow` className if `hasArrow` prop is provided', () => {
    const renderedComponent = shallow(<Label hasArrow />);
    expect(renderedComponent.hasClass('label--hasArrow')).toEqual(true);
  });

  it('should render Link if `linksTo` prop is provided', () => {
    const renderedComponent = shallow(<Label linksTo="/hey" />);
    expect(renderedComponent.find(Link).length).toEqual(1);
  });

  it('should render div if `linksTo` prop is not provided', () => {
    const renderedComponent = shallow(<Label />);
    expect(renderedComponent.find('div').length).toEqual(1);
  });

  it('should apply other props', () => {
    const renderedComponent = shallow(<Label style={{ hey: 'ho' }} />);
    expect(renderedComponent.prop('style')).toEqual({ hey: 'ho' });
  });
});
