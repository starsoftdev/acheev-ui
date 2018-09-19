// @flow

import * as React from 'react';
import { generate } from 'shortid';
import cx from 'classnames';

import './styles.scss';

type Props = {
  element?: string,
  className?: string,
  children?: any,
  id?: string,
  clickableText?: any,
  type?: string,
};

const Checkbox = (props: Props) => {
  const {
    element = 'input',
    type,
    id = generate(),
    className,
    children,
    clickableText,
    ...otherProps
  } = props;
  const mergedClassName = cx('checkbox row align-middle', className);
  const labelClassName = cx('checkbox__label shrink column', {
    npr: !!clickableText,
  });
  return (
    <span className={mergedClassName}>
      <div className="shrink column npr">
        {React.createElement(element, {
          className: 'checkbox__input',
          id,
          type: element === 'input' ? 'checkbox' : type, // For some reason react-formal's Field component works incorrectly when 'checkbox' is passed as default prop or default parameter in props spread. That's the only way it works.
          ...otherProps,
        })}
      </div>
      <label className={labelClassName} htmlFor={id}>
        {children}
      </label>
      {clickableText && (
        <div className="shrink column npl">&nbsp;{clickableText}</div>
      )}
    </span>
  );
};

export default Checkbox;
