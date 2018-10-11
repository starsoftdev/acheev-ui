// @flow

import React, { Component } from 'react';
import type { Map } from 'immutable';

import Gallery from './Gallery';

import './styles.scss';

type Props = {
  data: Map<Object>,
  title: string,
};

type State = {
  activeSlide: number,
};

class OfferGallery extends Component<Props, State> {
  state = {
    activeSlide: 0,
  };
  render() {
    const { data, title } = this.props;
    const activeImageURL = data && data.getIn([this.state.activeSlide, 'src']);
    return (
      <div className="offerGallery">
        <div className="offerGallery__activeImageContainer">
          <div
            className="offerGallery__activeImage"
            style={{
              backgroundImage: `url(${activeImageURL})`,
            }}
          />
          <div className="offerGallery__activeImageOverlay" />
          <h1 className="offerGallery__title">{title}</h1>
        </div>
        {data &&
          data.size > 1 && (
            <div className="offerGallery__carousel">
              <Gallery
                onSlideSelect={i => {
                  this.setState({ activeSlide: i });
                }}
                data={data}
              />
            </div>
          )}
      </div>
    );
  }
}

export default OfferGallery;
