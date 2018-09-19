// @flow

import React from 'react';

import './styles.scss';

type Props = {
  image?: string,
  title: string,
};

const Canabis101Banner = ({ image, title }: Props) => (
  <div
    className="c101banner"
    style={{
      backgroundImage: `url(${String(image)})`,
    }}
  >
    <h1 className="c101banner__title">{title}</h1>
  </div>
);

export default Canabis101Banner;
