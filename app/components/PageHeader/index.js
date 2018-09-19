// @flow

import * as React from 'react';

import './styles.scss';

type Props = {
  title: string,
};

const PageHeader = ({ title }: Props) => {
  if (!title) {
    return null;
  }
  return (
    <div className="pageHeader">
      <h1 className="nm">{title}</h1>
    </div>
  );
};

export default PageHeader;
