// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import cx from 'classnames';
import { fromJS } from 'immutable';
import type { Map } from 'immutable';

import SearchField from 'components/SearchField';
import Preloader from 'components/Preloader';

import './styles.scss';

type Props = {
  requestGlobalSearch: Function,
  filter: Map<*, *>,
  data: Map<string, Object>,
  isLoading?: boolean,
};

type State = {
  dropDownVisible: boolean,
  searchValue: string,
};

class GlobalSearch extends Component<Props, State> {
  static defaultProps = {
    filter: fromJS({}),
  };

  state = {
    dropDownVisible: false,
    searchValue: '',
  };

  componentWillMount() {
    const { filter } = this.props;
    this.setState({
      searchValue: filter.getIn(['query', 'q'], ''),
    });
    this.typingTimeout = 0;
  }

  componentDidMount() {
    window.addEventListener('click', this.closeDropDown, false);
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      searchValue: newProps.filter.getIn(['query', 'q'], ''),
    });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeDropDown, false);
  }

  onInputChange = (value: string) => {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    const timeoutId = setTimeout(() => {
      this.searchProduct(this.state.searchValue);
    }, 1000);
    this.setState({
      searchValue: value,
      dropDownVisible: value !== '',
    });
    this.typingTimeout = timeoutId;
  };

  onInputFocus = () => {
    const { searchValue } = this.state;
    this.setState({ dropDownVisible: searchValue !== '' });
  };

  onClickDropdown = e => {
    e.stopPropagation();
  };

  typingTimeout: number;

  closeDropDown = () => {
    this.setState({ dropDownVisible: false });
  };

  searchProduct = (value: string) => {
    this.props.requestGlobalSearch(['query', 'q'], value);
  };

  render() {
    const { dropDownVisible } = this.state;
    const { data, isLoading } = this.props;

    let listContent = (
      <div className="globalSearch__noData">No results found.</div>
    );

    if (data && data.size > 0) {
      listContent = data.entrySeq().map(([key, category]) => (
        <div key={key} className="globalSearch__subSection">
          <Link
            className="globalSearch__category"
            to={`/${key}`}
            onClick={this.closeDropDown}
          >
            {key}
          </Link>
          {category &&
            category.entrySeq().map(([index, value]) => (
              <Link
                key={index}
                className="globalSearch__linkItem"
                to={value.get('link')}
                onClick={this.closeDropDown}
              >
                {value.getIn(['item', 'name'])}
              </Link>
            ))}
        </div>
      ));
    }
    return (
      <div
        className={cx('globalSearch', {
          'globalSearch--open': dropDownVisible === true,
        })}
      >
        <div className="row align-middle nm">
          <div className="column np">
            <SearchField
              className="global"
              onChange={this.onInputChange}
              onFocus={this.onInputFocus}
              defaultValue={this.state.searchValue}
              onClick={this.onClickDropdown}
              placeholder="What skills are you looking for?"
            />
          </div>
        </div>
        {dropDownVisible === true && (
          <div
            className="globalSearch__dropDown"
            onClick={this.onClickDropdown}
            role="button"
          >
            <div className="row column">
              {isLoading ? (
                <Preloader height={300} />
              ) : (
                <div>{listContent}</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default GlobalSearch;
