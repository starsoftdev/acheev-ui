// @flow

import * as React from 'react';
import numeral from 'numeral';

type Props = {
  price?: number,
  unit?: string,
  doseAmount?: string,
  unitLabel?: string,
};

const ProductPrice = ({
  price,
  unit,
  doseAmount,
  unitLabel: propUnitLabel,
}: Props) => {
  const dosage = doseAmount === 1 ? '' : String(doseAmount);
  const unitLabel = doseAmount && unit ? `(${dosage}${unit})` : '';

  return (
    <span>
      {price ? (
        <span>
          ${numeral(price / 100).format('0.00')}{' '}
          <span className="t-lowercase">{propUnitLabel || unitLabel}</span>
        </span>
      ) : (
        '$N/A'
      )}
    </span>
  );
};

export default ProductPrice;
