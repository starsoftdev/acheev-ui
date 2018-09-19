// @flow

import React, { Component } from 'react';
import type { Map } from 'immutable';
import Carousel from 'components/Carousel';
import { generate } from 'shortid';

type Props = {
  data: Map<number, string>,
  onSlideSelect: Function,
};

const carouselSettings = {
  infinite: false,
  variableWidth: true,
};

class Gallery extends Component<Props> {
  shouldComponentUpdate() {
    return false; // without it react-slick rerenders when outer state changes because of the bug: https://github.com/akiran/react-slick/pull/700
  }
  carousel: Object;
  render() {
    const { data } = this.props;
    return (
      <Carousel
        {...carouselSettings}
        className="variable-width"
        instance={carousel => {
          this.carousel = carousel;
        }}
      >
        {data.map((item: string, i: number) => (
          <div key={generate()}>
            <div
              className="productGallery__carouselImg"
              style={{ backgroundImage: `url(${item})` }}
              onClick={() => {
                this.carousel.slickGoTo(i);
                this.props.onSlideSelect(i);
              }}
              role="button"
            />
          </div>
        ))}
      </Carousel>
    );
  }
}

export default Gallery;
