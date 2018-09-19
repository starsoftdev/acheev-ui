// @flow

import * as React from 'react';
import cx from 'classnames';
import type { List } from 'immutable';

import './styles.scss';

type Props = {
  images: List<Object>,
  size: string,
};

const FlexImagesContainer = ({ images, size }: Props) => (
  <div className="row text-center">
    <div className="flexImagesContainer">
      {images.entrySeq().map(([key, item]) => (
        <span
          className={cx(
            'flexImagesContainer__imageContainer',
            `flexImagesContainer__imageContainer--${size}`
          )}
          key={key}
        >
          <img
            className="flexImagesContainer__image"
            src={item.get('src')}
            alt={item.get('alt')}
          />
        </span>
      ))}
    </div>
  </div>
);

export default FlexImagesContainer;
