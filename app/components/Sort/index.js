// @flow

import * as React from 'react';

import CustomSelect from 'components/CustomSelect';

type Props = {
  options: Array<Object>,
  value: string,
  sort: Function,
};
const Sort = ({ options, value, sort }: Props) => (
  <div className="row align-middle mb-xl">
    <div className="shrink columns npr mb-sm">
      <label htmlFor="sort">Sort By:</label>
    </div>
    <div className="shrink columns mb-sm">
      <CustomSelect
        name="sort"
        className="large"
        options={options}
        value={value}
        clearable={false}
        onChange={e => {
          sort(e.value);
        }}
      />
    </div>
  </div>
);

export default Sort;
