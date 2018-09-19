// @flow

import * as React from 'react';
import { Field } from 'react-formal';
import cx from 'classnames';

import './styles.scss';

type Props = {
  className?: string,
  name?: string,
  id?: string,
  rows?: number,
  onChange?: Function,
  onFocus?: Function,
  onBlur?: Function,
};

const TextAreaField = ({
  className,
  name,
  id,
  rows,
  onChange,
  onFocus,
  onBlur,
}: Props) => {
  const containerClassName = cx('textAreaField accent', className);
  function eventHandler(val, cb) {
    if (cb) {
      cb(val);
    }
  }
  return (
    <Field
      className={containerClassName}
      name={name}
      id={id}
      type="textarea"
      rows={rows}
      onChange={val => {
        eventHandler(val, onChange);
      }}
      onFocus={val => {
        eventHandler(val, onFocus);
      }}
      onBlur={val => {
        eventHandler(val, onBlur);
      }}
    />
  );
};

export default TextAreaField;
