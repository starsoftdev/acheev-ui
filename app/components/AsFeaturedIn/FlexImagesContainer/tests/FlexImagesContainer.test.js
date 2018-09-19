import React from 'react';
import { shallow } from 'enzyme';
import FlexImagesContainer from 'components/AsFeaturedIn/FlexImagesContainer';
import { topRowImages } from 'components/AsFeaturedIn';

describe('<FlexImagesContainer />', () => {
  it('should apply size', () => {
    const renderedComponent = shallow(
      <FlexImagesContainer images={topRowImages} size="small" />
    );
    renderedComponent
      .find('.flexImagesContainer__imageContainer')
      .forEach(i => {
        expect(
          i.hasClass('flexImagesContainer__imageContainer--small')
        ).toEqual(true);
      });
  });

  it('should render appropriate qty of images', () => {
    const renderedComponent = shallow(
      <FlexImagesContainer images={topRowImages} />
    );
    expect(renderedComponent.find('img').length).toEqual(topRowImages.size);
  });

  it('should apply alt to images', () => {
    const renderedComponent = shallow(
      <FlexImagesContainer images={topRowImages} />
    );
    renderedComponent.find('img').forEach((node, i) => {
      expect(node.prop('alt')).toEqual(topRowImages.getIn([i, 'alt']));
    });
  });
});
