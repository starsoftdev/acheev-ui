import React from 'react';
import { shallow, render } from 'enzyme';
import ReviewCount from 'components/ReviewCount';
import Link from 'components/Link';
import Icon from 'components/Icon';
import vapeIcon from 'images/sprite/vape.svg';

describe('<ReviewCount />', () => {
  it('should apply given className', () => {
    const renderedComponent = shallow(<ReviewCount className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should be centered if appropriate prop is specified', () => {
    const renderedComponent = shallow(<ReviewCount centered />);
    expect(
      renderedComponent
        .find('.reviewCount__starsContainer')
        .hasClass('align-center')
    ).toEqual(true);
  });

  it('should render reviewCount', () => {
    const renderedComponent = shallow(<ReviewCount reviewCount={99} />);
    expect(renderedComponent.contains(99)).toEqual(true);
  });

  it('should render ratingsAverage', () => {
    const renderedComponent = shallow(<ReviewCount ratingsAverage={4.5} />);
    expect(renderedComponent.contains(4.5)).toEqual(true);
  });

  it('should render type', () => {
    const renderedComponent = render(<ReviewCount type="hey" />);
    expect(renderedComponent.text()).toContain('hey');
  });

  it('should render Link with `to` prop is it is specified', () => {
    const renderedComponent = shallow(<ReviewCount to="/hey" />);
    expect(renderedComponent.find(Link).prop('to')).toEqual('/hey');
  });

  it('should have Icon from prop `icon`', () => {
    const renderedComponent = shallow(<ReviewCount prefixIcon={vapeIcon} />);
    expect(renderedComponent.find(Icon).prop('glyph')).toEqual(vapeIcon);
  });
});
