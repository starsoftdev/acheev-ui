import React from 'react';
import { shallow } from 'enzyme';
import ImageLightbox from 'components/ImageLightbox';
import Lightbox from 'react-image-lightbox';

import mainIcon from 'images/sprite/vape.svg';
import prevIcon from 'images/sprite/evening.svg';
import nextIcon from 'images/sprite/joint.svg';

describe('<ImageLightbox />', () => {
  it('should accept correct props', () => {
    const renderedComponent = shallow(
      <ImageLightbox
        mainSrc={mainIcon}
        prevSrc={prevIcon}
        nextSrc={nextIcon}
        onCloseRequest={() => {}}
      />
    );
    expect(renderedComponent.find(Lightbox).prop('mainSrc')).toEqual(mainIcon);
    expect(renderedComponent.find(Lightbox).prop('prevSrc')).toEqual(prevIcon);
    expect(renderedComponent.find(Lightbox).prop('nextSrc')).toEqual(nextIcon);
  });
});
