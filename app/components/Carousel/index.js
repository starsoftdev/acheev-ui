// @flow

import React, { Component } from 'react';
import Slick from 'react-slick';
import cx from 'classnames';

import Icon from 'components/Icon';

import ChevronLeft from 'images/sprite/chevron-left.svg';

import './styles.scss';

type Props = {
  instance?: Function,
  fullHeight?: boolean,
  className?: string,
  prevArrow?: any,
  nextArrow?: any,
  shouldComponentUpdate?: boolean,
};

type ArrowProps = {
  onClick?: Function,
  className?: string,
};

function SamplePrevArrow({ onClick, className }: ArrowProps) {
  return (
    <div className={className} onClick={onClick} role="button">
      <Icon glyph={ChevronLeft} size={10} />
    </div>
  );
}

function SampleNextArrow({ onClick, className }: ArrowProps) {
  return (
    <div className={className} onClick={onClick} role="button">
      <Icon glyph={ChevronLeft} size={10} />
    </div>
  );
}

class Carousel extends Component<Props> {
  static defaultProps = {
    shouldComponentUpdate: true,
  };
  shouldComponentUpdate({ shouldComponentUpdate }: Props) {
    return shouldComponentUpdate;
  }
  instance: Object;
  render() {
    const {
      instance,
      fullHeight,
      className,
      prevArrow,
      nextArrow,
      ...otherProps
    } = this.props;
    const mergedClassName = cx(className, { fullHeight });
    return (
      <Slick
        className={mergedClassName}
        prevArrow={prevArrow || <SamplePrevArrow />}
        nextArrow={nextArrow || <SampleNextArrow />}
        {...otherProps}
        ref={instance}
      />
    );
  }
}

export default Carousel;
