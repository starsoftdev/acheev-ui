// @flow

import React, { Component } from 'react';
import cx from 'classnames';

import renderCategoryName from 'utils/renderCategoryName';

import Link from 'components/Link';
import Button from 'components/Button';
import SearchField from 'components/SearchField';
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';
import Banner from 'components/PageBanner';

import Sliders from 'images/sprite/sliders.svg';
import ChevronDown from 'images/sprite/chevron-down.svg';

import './styles.scss';

const classNames = {
  Oil: 'filter__oilBanner',
  Strain: 'filter__flowerBanner',
  Product: 'filter__productBanner',
  Producer: 'filter__producersBanner',
  Clinic: 'filter__clinicsBanner',
};

type Props = {
  requestItems: Function,
  isBanner?: boolean,
  category?: string,
  filter: Object, // eslint-disable-line react/no-unused-prop-types
  bottomComponent?: Object,
};

type State = {
  filterVisible: boolean,
  searchValue: string,
  typingTimeout?: TimeoutID,
};

class Filter extends Component<Props, State> {
  static getDerivedStateFromProps(props: Props) {
    return {
      searchValue: props.filter.getIn(['query', 'q'], ''),
    };
  }

  state = {
    filterVisible: false,
    searchValue: '',
  };

  onInputChange = (value: string) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    const timeoutId = setTimeout(() => {
      this.searchProduct(this.state.searchValue);
    }, 1000);
    this.setState({
      searchValue: value,
      typingTimeout: timeoutId,
    });
  };

  onSelectChange = (value: Object, path: string) => {
    this.props.requestItems(path, value);
  };

  searchProduct = (value: string) => {
    this.props.requestItems(['query', 'q'], value);
  };

  toggleFilter = () => {
    this.setState({ filterVisible: !this.state.filterVisible });
  };

  renderBannerContent = (category: string) => (
    <div className="row align-center fw">
      <div className="column small-12 medium-8">
        <h2 className="filter__bannerTitle row align-center align-middle">
          <div className="shrink column np">Looking for&nbsp;</div>
          <div className="shrink column np">
            <Dropdown
              dropdownContent={
                <div className="filter__bannerDropdown">
                  <Link to="/strains" className="filter__bannerDropdownItem">
                    Strain
                  </Link>
                  <Link to="/oils" className="filter__bannerDropdownItem">
                    Oil
                  </Link>
                  <Link to="/clinics" className="filter__bannerDropdownItem">
                    Clinic
                  </Link>
                  <Link to="/producers" className="filter__bannerDropdownItem">
                    Producer
                  </Link>
                </div>
              }
            >
              <span className="mr-sm">
                <u>{renderCategoryName(category)}</u>?
              </span>
              <Icon
                glyph={ChevronDown}
                className="filter__bannerDropdownIcon"
                size={25}
              />
            </Dropdown>
          </div>
        </h2>
        <SearchField
          className="global"
          onChange={this.onInputChange}
          defaultValue={this.state.searchValue}
          placeholder={`Start typing ${renderCategoryName(category)}`}
        />
      </div>
    </div>
  );
  render() {
    const { filterVisible } = this.state;
    const { bottomComponent, isBanner, category } = this.props;
    return (
      <div className="filter">
        {isBanner && category ? (
          <Banner
            expanded
            className={cx('filter__bannerFilter', classNames[category])}
            bottomComponent={this.renderBannerContent(category)}
          />
        ) : (
          <div className="filter__container">
            <div className="filter__top row align-middle">
              <div className="filter__topItem column">
                <SearchField
                  className="dark"
                  onChange={this.onInputChange}
                  defaultValue={this.state.searchValue}
                />
              </div>
              <div className="filter__topItem shrink column">
                <Button
                  element="button"
                  className="small"
                  onClick={this.toggleFilter}
                >
                  <div className="hide-for-small-only">
                    {filterVisible ? 'Hide' : 'Show'} filter
                  </div>
                  <Icon className="hide-for-medium" glyph={Sliders} size={14} />
                </Button>
              </div>
            </div>
            {filterVisible && bottomComponent}
          </div>
        )}
      </div>
    );
  }
}

export default Filter;
