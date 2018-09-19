// @flow

import React from 'react';
import Loadable from 'react-loadable';
import Preloader from 'components/Preloader';

type Props = {
  loader: Function,
};

const Load = ({ loader, ...otherProps }: Props) => {
  const LoadableComponent = Loadable({ loader, loading: Preloader });
  return <LoadableComponent {...otherProps} />;
};

export default Load;
