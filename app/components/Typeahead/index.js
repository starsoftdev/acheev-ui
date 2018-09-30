// @flow

import * as React from 'react';
import Select from 'components/CustomSelect';

import './styles.scss';

const LiftTypeahead = ({
  searchable, // prevent these props being overwritten
  clearable = true, // because these are crucial for correct
  disableOptionClearable,
  tabSelectsValue, // functioning of Typeahead component
  name,
  ...otherProps
}: Object) => (
  <Select
    searchable
    clearable={clearable}
    clearableValue={!disableOptionClearable}
    name={name || 'acheev-typeahead'}
    tabSelectsValue={false}
    {...otherProps}
  />
);

export default LiftTypeahead;
