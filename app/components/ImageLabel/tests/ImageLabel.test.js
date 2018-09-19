import React from 'react';
import { shallow } from 'enzyme';
import ImageLabel from 'components/ImageLabel';
import Icon from 'components/Icon';
import vapeIcon from 'images/sprite/vape.svg';

describe('<ImageLabel />', () => {
  it('should have title from prop `title`', () => {
    const renderedComponent = shallow(<ImageLabel title="Hello" />);
    expect(renderedComponent.contains('Hello')).toEqual(true);
  });

  it('should apply given className', () => {
    const renderedComponent = shallow(<ImageLabel className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should have Icon from prop `icon`', () => {
    const renderedComponent = shallow(<ImageLabel icon={vapeIcon} />);
    expect(renderedComponent.find(Icon).prop('glyph')).toEqual(vapeIcon);
  });

  it('should have children from prop `children`', () => {
    const renderedComponent = shallow(
      <ImageLabel title="Hello">
        <div>Hey</div>
      </ImageLabel>
    );
    expect(renderedComponent.contains(<div>Hey</div>)).toEqual(true);
  });
});
