// @flow

import * as React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  title?: string,
  titleLarge?: boolean,
  subtitle?: string,
  bg?: string,
  bottomComponent?: any,
  expanded?: boolean,
  responsiveBg?: boolean,
  className?: string,
};

const PageBanner = ({
  title,
  subtitle,
  bg,
  bottomComponent,
  titleLarge,
  expanded = false,
  responsiveBg = false,
  className,
}: Props) => {
  const subTitleClassName = cx('pageBanner__subtitle', {
    'mb-md': bottomComponent,
  });
  const titleClassName = cx('pageBanner__title', {
    'pageBanner__title--large': titleLarge,
  });
  const bannerClassName = cx('pageBanner', className, {
    'pageBanner--responsiveBg': responsiveBg,
  });
  const style = {};

  if (bg) {
    style.backgroundImage = `url(${bg})`;
  }

  return (
    <div className={cx({ 'row column': expanded === false })}>
      <div className={bannerClassName} style={style}>
        {title && <h1 className={titleClassName}>{title}</h1>}
        {subtitle && <h5 className={subTitleClassName}>{subtitle}</h5>}
        {bottomComponent}
      </div>
    </div>
  );
};

export default PageBanner;
