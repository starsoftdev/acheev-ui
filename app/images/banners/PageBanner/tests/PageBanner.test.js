import React from 'react';
import { shallow } from 'enzyme';
import PageBanner from 'components/PageBanner';
import AboutImg from 'images/banners/about.jpg';

describe('<PageBanner />', () => {
  it('should have correct class from prop `className`', () => {
    const renderedComponent = shallow(<PageBanner className="Hello" />);
    expect(renderedComponent.children().hasClass('Hello')).toEqual(true);
  });

  it('should have correct title', () => {
    const renderedComponent = shallow(<PageBanner title="Hello" />);
    expect(renderedComponent.contains('Hello')).toEqual(true);
  });

  it('should have correct subtitle', () => {
    const renderedComponent = shallow(<PageBanner subtitle="Hello Sub" />);
    expect(renderedComponent.contains('Hello Sub')).toEqual(true);
  });

  it('should have proper initialRating', () => {
    const renderedComponent = shallow(<PageBanner bg={AboutImg} />);
    expect(
      renderedComponent.find('.pageBanner').prop('style').backgroundImage
    ).toEqual(`url(${AboutImg})`);
  });

  it('should unexpanded layout by default', () => {
    const renderedComponent = shallow(<PageBanner />);
    expect(renderedComponent.hasClass('row column')).toEqual(true);
  });

  it('should render expanded layout', () => {
    const renderedComponent = shallow(<PageBanner expanded />);
    expect(renderedComponent.hasClass('row column')).toEqual(false);
  });

  it('should render bottomComponent', () => {
    const renderedComponent = shallow(
      <PageBanner bottomComponent={<div>Bottom Text</div>} />
    );
    expect(renderedComponent.contains(<div>Bottom Text</div>)).toEqual(true);
  });
});
