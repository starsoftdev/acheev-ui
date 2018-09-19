// @flow

import * as React from 'react';

import './styles.scss';

type Props = {
  title: string,
  children: any,
};

const LPTitleHeader = ({ title, children }: Props) => (
  <div className="lpTitleHeader row align-middle">
    <div className="small-12 medium-expand column">
      <h4 className="lpTitleHeader__title">{title}</h4>
    </div>
    <div className="shrink column">{children}</div>
  </div>
);

export default LPTitleHeader;
