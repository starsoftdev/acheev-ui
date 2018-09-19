// @flow

import * as React from 'react';

import './styles.scss';

type Props = {
  children?: any,
};

const Select = (props: Props) => <select {...props}>{props.children}</select>;

export default Select;
