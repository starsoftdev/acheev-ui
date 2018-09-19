import React from 'react';
import { shallow } from 'enzyme';
import BorderedTitle from 'components/BorderedTitle';

describe('<BorderedTitle />', () => {
  it('should render <h1> if element="h1"', () => {
    const renderedComponent = shallow(<BorderedTitle element="h1" />);
    expect(renderedComponent.find('h1').length).toEqual(1);
  });

  it('should render its children', () => {
    const renderedComponent = shallow(<BorderedTitle>hey ho</BorderedTitle>);
    expect(renderedComponent.text()).toEqual('hey ho');
  });

  it('should apply given className', () => {
    const renderedComponent = shallow(<BorderedTitle className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should be centered if appropriate prop is specified', () => {
    const renderedComponent = shallow(<BorderedTitle centered />);
    expect(renderedComponent.hasClass('borderedTitle--centered')).toEqual(true);
  });

  it('should be leftAligned if appropriate prop is specified', () => {
    const renderedComponent = shallow(<BorderedTitle leftAligned />);
    expect(renderedComponent.hasClass('borderedTitle--leftAligned')).toEqual(
      true
    );
  });
});
