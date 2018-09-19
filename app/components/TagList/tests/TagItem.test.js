import React from 'react';
import { shallow } from 'enzyme';
import TagItem from 'components/TagList/TagItem';
import Icon from 'components/Icon';
import IconClose from 'images/sprite/close.svg';

describe('<TagItem />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<TagItem />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should have correct className', () => {
    const renderedComponent = shallow(
      <TagItem value="Hooray" className="hey" />
    );
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should have correct value', () => {
    const renderedComponent = shallow(<TagItem value="hello" />);
    expect(renderedComponent.contains('hello')).toEqual(true);
  });

  it('should have correct close button by default', () => {
    const renderedComponent = shallow(<TagItem value="hello" />);
    expect(renderedComponent.find('.tagItem__close').prop('glyph')).toEqual(
      IconClose
    );
  });

  it('should not have cloase button when it is read only', () => {
    const renderedComponent = shallow(<TagItem value="hello" readOnly />);
    expect(renderedComponent.find('.tagItem__close')).toHaveLength(0);
  });

  it('onRemove should be fired', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(<TagItem value="hello" onRemove={spy} />);
    renderedComponent.find(Icon).simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});
