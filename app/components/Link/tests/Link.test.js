import React from 'react';
import { shallow } from 'enzyme';
import CustomLink from 'components/Link';
import { NavHashLink, HashLink } from 'react-router-hash-link';

describe('<Link />', () => {
  it('should render <HashLink> if `to` prop is internal', () => {
    const renderedComponent = shallow(<CustomLink to="/hey" />);
    expect(renderedComponent.find(HashLink).length).toEqual(1);
  });

  it('should render <NavHashLink> if activeClassName is specified', () => {
    const renderedComponent = shallow(
      <CustomLink to="/hey" activeClassName="hey" />
    );
    expect(renderedComponent.type()).toEqual(NavHashLink);
  });

  it('should render <a> if "to" prop is external', () => {
    const renderedComponent = shallow(<CustomLink to="http://example.com" />);
    expect(renderedComponent.type()).toEqual('a');
  });

  it('should render <a> if "to" prop is not specified', () => {
    const renderedComponent = shallow(<CustomLink />);
    expect(renderedComponent.type()).toEqual('a');
  });

  it('should apply given className', () => {
    const renderedComponent = shallow(<CustomLink className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should apply given activeClassName when `to` is internal', () => {
    const renderedComponent = shallow(
      <CustomLink activeClassName="hey" to="/hey" />
    );
    expect(renderedComponent.prop('activeClassName')).toEqual('hey');
  });

  it("shouldn't apply given activeClassName when `to` is external", () => {
    const renderedComponent = shallow(
      <CustomLink activeClassName="hey" to="http://example.com" />
    );
    expect(renderedComponent.prop('activeClassName')).toEqual(undefined);
  });

  it('should render its children', () => {
    const renderedComponent = shallow(<CustomLink>hey ho</CustomLink>);
    expect(renderedComponent.find('a').text()).toEqual('hey ho');
  });

  it('should apply custom props', () => {
    const renderedComponent = shallow(<CustomLink hey="ho" />);
    expect(renderedComponent.prop('hey')).toEqual('ho');
  });
});
