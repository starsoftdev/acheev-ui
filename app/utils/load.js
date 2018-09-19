// @flow

import React from 'react';
import Loadable from 'react-loadable';
import Preloader from 'components/Preloader';

const createLoadable = (loader: () => Promise<*>) =>
  Loadable({
    loader,
    loading: function loading() {
      return <Preloader />;
    },
  });

export default createLoadable;
