// @flow

import * as React from 'react';

import Button from 'components/Button';
import Icon from 'components/Icon';
import SearchIcon from 'images/sprite/search.svg';
import ReactSelect from 'react-select';
import './styles.scss';

type Props = {
  onChange: Function,
  onClick?: Function,
  value: ?Object,
  options: Array<Object>,
  meta: Array<string>,
};

const SearchSelect = ({ onChange, onClick, value, options, meta }: Props) => {
  function onChangeHandler(val: string) {
    if (onChange) onChange(val, meta);
  }
  return (
    <div className="searchSelect">
      <ReactSelect
        searchable
        options={options}
        multi={false}
        value={value}
        clearable
        onChange={onChangeHandler}
        placeholder="Search"
      />
      <Button
        className="searchSelect__button secondary"
        element="button"
        onClick={onClick}
      >
        <Icon className="searchSelect__icon" glyph={SearchIcon} size={14} />
      </Button>
    </div>
  );
};

export default SearchSelect;
