// @flow

import * as React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  className?: string,
};

const Spinner = ({ className }: Props) => {
  const mergedClassName = cx('spinner', className);
  return (
    <div className={mergedClassName}>
      <div className="spinner__item spinner__item--1" />
      <div className="spinner__item spinner__item--2" />
      <div className="spinner__item spinner__item--3" />
      <div className="spinner__item spinner__item--4" />
      <div className="spinner__item spinner__item--5" />
      <div className="spinner__item spinner__item--6" />
      <div className="spinner__item spinner__item--7" />
      <div className="spinner__item spinner__item--8" />
    </div>
  );
};

export default Spinner;
