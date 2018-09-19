// @flow

import * as React from 'react';

type Props = {
  glyph: any, // should be Object, but Flow for some reason thinks this is a string
  width?: any,
  height?: number,
  size?: number,
  className?: string,
  onClick?: Function,
};

const Icon = ({ glyph, width, height, size, className, onClick }: Props) => (
  <svg
    className={className}
    width={width || size}
    height={height || size}
    onClick={onClick}
    viewBox={glyph.viewBox}
  >
    <use xlinkHref={`#${glyph.id}`} />
  </svg>
);

Icon.defaultProps = {
  size: 14,
};

export default Icon;
