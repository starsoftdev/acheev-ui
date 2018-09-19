// @flow

import * as React from 'react';
import Link from 'components/Link';

import Button from 'components/Button';

const Tab = (props: Object) => (
  <Button
    element={Link}
    className="light hollow"
    activeClassName="active"
    exact
    {...props}
  >
    {props.children}
  </Button>
);

export default Tab;
