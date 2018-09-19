// @flow

import CONFIG from '../../conf';
import React, { Component } from 'react';
import type { Map } from 'immutable';
import { generate } from 'shortid';
import LazyLoad from 'react-lazyload';

import Preloader from 'components/Preloader';
import ImageLightbox from 'components/ImageLightbox';

import './styles.scss';

type Props = {
  isLoading: boolean,
  data: Map<string, Object>,
};

class PhotoList extends Component<
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
    const { data, isLoading } = this.props;

    const { isOpen, photoIndex } = this.state;

    return (
      <div className="photoList">
        {isLoading ? (
          <Preloader />
        ) : (
          <div className="row">
            {data &&
              data.entrySeq().map(([key, image]) => (
                <div
                  className="column small-12 medium-6 large-3 mb-mx"
                  key={generate()}
                >
                  <LazyLoad height={200}>
                    <div
                      className="photoList__image"
                      style={{
                        backgroundImage: `url('${CONFIG.APP.CDN_URL}/resize/270x270/${image}')`,
                      }}
                      onClick={() => {
                        this.setState({
                          isOpen: true,
                          photoIndex: key,
                        });
                      }}
                      role="button"
                    />
                  </LazyLoad>
                </div>
              ))}
            {isOpen &&
              data && (
                <ImageLightbox
                  mainSrc={data.get(photoIndex)}
                  nextSrc={data.get((photoIndex + 1) % data.size)}
                  prevSrc={data.get((photoIndex + data.size - 1) % data.size)}
                  onCloseRequest={() => this.setState({ isOpen: false })}
                  onMovePrevRequest={() =>
                    this.setState({
                      photoIndex: (photoIndex + data.size - 1) % data.size,
                    })}
                  onMoveNextRequest={() =>
                    this.setState({
                      photoIndex: (photoIndex + 1) % data.size,
                    })}
                />
              )}
          </div>
        )}
      </div>
    );
  }
}

export default PhotoList;
