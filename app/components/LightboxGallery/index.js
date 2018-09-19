// @flow

import CONFIG from '../../conf';
import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import ImageLightbox from 'components/ImageLightbox';
import type { List, Map } from 'immutable';

import './styles.scss';

type Props = {
  images: List<Map<*, *>>,
  className?: string,
};

class LightboxGallery extends Component<
  Props,
  {
    photoIndex: number,
    isOpen: boolean,
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }
  render() {
    const { images, className } = this.props;
    const { isOpen, photoIndex } = this.state;
    const mergedClassName = cx(className, 'lightboxGallery row');
    return (
      <div className={mergedClassName}>
        {images &&
          images.entrySeq().map(([key, image]) => (
            <div className="column small-4 mb-md" key={generate()}>
              <img
                className="lightboxGallery__image"
                src={`${CONFIG.APP.CDN_URL}/resize/270x270/${image}`}
                alt={image}
                onClick={() => {
                  this.setState({
                    isOpen: true,
                    photoIndex: key,
                  });
                }}
                role="button"
              />
            </div>
          ))}
        {isOpen &&
          images && (
            <ImageLightbox
              mainSrc={images.get(photoIndex)}
              nextSrc={images.get((photoIndex + 1) % images.size)}
              prevSrc={images.get((photoIndex + images.size - 1) % images.size)}
              onCloseRequest={() => this.setState({ isOpen: false })}
              onMovePrevRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + images.size - 1) % images.size,
                })}
              onMoveNextRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + 1) % images.size,
                })}
            />
          )}
      </div>
    );
  }
}

export default LightboxGallery;
