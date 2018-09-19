// @flow
import * as React from 'react';
import cx from 'classnames';

type Props = {
  children: React.Node,
  label: string,
  className?: string,
  selected?: boolean,
};

const Block = ({ children, label, className, selected, ...rest }: Props) => (
  <div
    className={cx('recommendationWizard__block', className, {
      'recommendationWizard__block--selected': selected,
    })}
    {...rest}
  >
    {children}
    <p className="recommendationWizard__label">{label}</p>
  </div>
);

export default Block;
