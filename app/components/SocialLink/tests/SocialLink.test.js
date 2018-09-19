import React from 'react';
import { shallow } from 'enzyme';
import SocialLink from 'components/SocialLink';
import Icon from 'components/Icon';
import chevronIcon from 'images/sprite/chevron-up.svg';

describe('<SocialLink />', () => {
  it('should have correct link', () => {
    const renderedComponent = shallow(<SocialLink link="/targets" />);
    expect(renderedComponent.find('a[href="/targets"]').length).toEqual(1);
  });

  it('should have correct icon', () => {
    const renderedComponent = shallow(
      <SocialLink link="/targets" icon={chevronIcon} />
    );
    expect(renderedComponent.find(Icon).prop('glyph')).toEqual(chevronIcon);
  });

  it('should render Icon with correct className', () => {
    const renderedComponent = shallow(
      <SocialLink link="/targets" icon={chevronIcon} className="hey" />
    );
    expect(renderedComponent.find(Icon).hasClass('hey')).toEqual(true);
  });
});
