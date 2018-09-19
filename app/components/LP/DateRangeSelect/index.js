// @flow

import * as React from 'react';

import Icon from 'components/Icon';
import CustomSelect from 'components/CustomSelect';

import Calendar from 'images/sprite/calendar.svg';

import './styles.scss';

type Props = {
  onChange: Function,
  options: Array<Object>,
  value: Object,
  clearable?: boolean,
};

const DateRangeSelect = ({
  onChange,
  options,
  value,
  clearable = true,
}: Props) => (
  <div className="dateRangeSelect">
    <div className="row align-middle">
      <div className="shrink column npr">
        <Icon glyph={Calendar} size={12} />
      </div>
      <div className="shrink column">
        <CustomSelect
          clearable={clearable}
          onChange={onChange}
          sortAlphabetically={false}
          options={options}
          value={value}
        />
      </div>
    </div>
  </div>
);

export default DateRangeSelect;
