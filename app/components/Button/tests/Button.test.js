import React from 'react';
import { shallow } from 'enzyme';
import Button from 'components/Button';
import Spinner from 'components/Spinner';
import Link from 'components/Link';

describe('<Button />', () => {
  it('should render <Spinner /> if `isLoading` prop is provided', () => {
    const renderedComponent = shallow(<Button isLoading />);
    expect(renderedComponent.find(Spinner).length).toEqual(1);
  });

  it('should be disabled if `disabled` prop is provided', () => {
    const renderedComponent = shallow(<Button element="button" disabled />);
    expect(renderedComponent.find('button').prop('disabled')).toEqual(true);
  });

  it('should apply type to button', () => {
    const renderedComponent = shallow(
      <Button element="button" type="submit" />
    );
    expect(renderedComponent.find('button').prop('type')).toEqual('submit');
  });

  it('should render `<Link>` with appropriate `to` prop if `to` prop is provided', () => {
    const renderedComponent = shallow(<Button element={Link} to="/hey" />);
    expect(renderedComponent.find(Link).prop('to')).toEqual('/hey');
  });

  it('should render `<Link>` with appropriate `activeClassName` prop if `activeClassName` prop is provided', () => {
    const renderedComponent = shallow(
      <Button element={Link} activeClassName="hey" />
    );
    expect(renderedComponent.find(Link).prop('activeClassName')).toEqual('hey');
  });

  it('should render <a> if `element` prop is not provided', () => {
    const renderedComponent = shallow(<Button />);
    expect(renderedComponent.find('a').length).toEqual(1);
  });

  it('should render <Link> if element={Link}', () => {
    const renderedComponent = shallow(<Button element={Link} />);
    expect(renderedComponent.find(Link).length).toEqual(1);
  });

  it('should render its children', () => {
    const renderedComponent = shallow(<Button>hey ho</Button>);
    expect(renderedComponent.text()).toEqual('hey ho');
  });

  it('should apply given className', () => {
    const renderedComponent = shallow(<Button className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });
});
