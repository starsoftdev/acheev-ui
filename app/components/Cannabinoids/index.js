// @flow

import * as React from 'react';
import cx from 'classnames';
import numeral from 'numeral';

import './styles.scss';

type Props = {
  className?: string,
  thc: string,
  cbd: string,
  category?: string,
};

const Cannabinoids = ({ className, thc, cbd, category = '' }: Props) => {
  if (!thc && !cbd) return null;
  const unit = category === 'Oil' ? ' mg/ml' : '%';
  const thcText = `${numeral(thc).format('0.[0]')}${unit}`;
  const cbdText = `${numeral(cbd).format('0.[0]')}${unit}`;
  const mergedClassName = cx(className, 'cannabinoids row align-center');
  return (
    <div className={mergedClassName}>
      {thc !== null && (
        <div className="shrink column t-nowrap">
          <strong>THC</strong> {thcText}
        </div>
      )}
      {cbd !== null && (
        <div className="shrink column t-nowrap">
          <strong>CBD</strong> {cbdText}
        </div>
      )}
    </div>
  );
};

export default Cannabinoids;
