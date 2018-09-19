// @flow

import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';

type Props = {
  children?: React.Element<any>,
};

class ImageLightbox extends Component<Props> {
  render() {
    return <Lightbox {...this.props}>{this.props.children}</Lightbox>;
  }
}

export default ImageLightbox;
