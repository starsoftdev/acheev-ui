// @flow

import React, { Component } from 'react';
import { includes } from 'lodash-es';
import { fromJS } from 'immutable';
import { generate } from 'shortid';
import type { Map } from 'immutable';
import Sticky from 'react-stickynode';

import transformOptions from 'utils/transformOptions';
import deepReplace from 'utils/deepReplaceToString';
import isMobile from 'utils/checkMobile';

import Link from 'components/Link';
import CustomSelect from 'components/CustomSelect';
import Checkbox from 'components/Checkbox';
import { Checkbox as CheckboxItem, CheckboxGroup } from 'react-checkbox-group';
import Icon from 'components/Icon';
import StarRating from 'components/StarRating';
import RangeSlider from 'components/RangeSlider';

import FILTER_OPTIONS from 'enum/filter/options';

import IconShowAll from 'images/sprite/ClearAll.svg';
import IconFilter from 'images/sprite/Filter.svg';
import IconChevronUp from 'images/sprite/chevron-up.svg';
import IconChevronDown from 'images/sprite/chevron-down.svg';
import IconAward from 'images/sprite/Laurel.svg';
import './styles.scss';

type Props = {
  // Props to use the first way to use the component
  category?: string,
  options?: Map<*, *>,
  value?: Map<*, *>,
  onChange?: Function,
  lpVersion?: boolean,

  // Props to use the second way to use the component
  requestProducts?: Function,
  setQuery?: (query?: Map<*, *>) => void,
  resetQuery?: Function,
  filter?: Object,
};

type State = {
  value: Map<*, *>,
  showFilter: boolean,

  query: Map<*, *>,
};

function getPriceFilterLabel(category) {
  let label = '';
  switch (category) {
    case 'Strain':
      label = 'Price ($/g)';
      break;
    case 'Oil':
      label = 'Price ($/ml)';
      break;
    default:
      label = 'PRICE ($)';
      break;
  }
  return label;
}

class ProductFilter extends Component<Props, State> {
  state = {
    value: fromJS({}),
    query: fromJS({}),
    showFilter: true,
  };

  componentWillMount() {
    const { filter, value } = this.props;
    this.setState({ value });

    if (filter) {
      let query = filter.get('query');
      query = query.delete('q');

      this.setState({ query });
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.filter) {
      this.setState({
        query: newProps.filter.get('query'),
      });
    }

    this.setState({
      value: newProps.value,
    });
  }

  onSelectChange = (value: Object, path: Array<string>) => {
    if (this.props.onChange) {
      let newValue;
      if (!value || value.length === 0) {
        newValue = this.state.value.deleteIn(path);
      } else {
        newValue = this.state.value.setIn(path, fromJS(deepReplace(value)));
      }

      this.props.onChange(newValue);
    }

    this.requestProducts(path, deepReplace(value));
  };

  onCheckGroupChange = (param: Array<string>, queryType: Array<string>) => {
    if (this.props.onChange) {
      let newValue;
      if (!queryType) {
        newValue = this.state.value.deleteIn(param);
      } else {
        newValue = this.state.value.setIn(param, fromJS(queryType));
      }

      this.props.onChange(newValue);
    }

    this.requestProducts(param, queryType);
  };

  onRangeInternalChange = (param: Array<string>, queryType: Array<string>) => {
    let newValue;
    let field = 'query';

    if (this.props.onChange) {
      field = 'value';
    }

    if (!queryType) {
      newValue = this.state[field].deleteIn(param);
    } else {
      newValue = this.state[field].setIn(param, fromJS(queryType));
    }

    this.setState({ [field]: newValue });
  };

  onCheckChange = (checked: string, path: Array<string>) => {
    if (this.props.onChange) {
      let newValue;
      if (!checked) {
        newValue = this.state.value.deleteIn(path);
      } else {
        newValue = this.state.value.setIn(path, checked);
      }

      this.props.onChange(newValue);
    }

    let value = checked;
    if (!value) {
      value = null;
    }
    this.requestProducts(path, value);
  };

  requestProducts = (path: Array<string>, value: any) => {
    if (this.props.requestProducts) {
      let { query } = this.state;
      if (!value || value.length === 0) {
        query = query.deleteIn(path);
      } else {
        query = query.setIn(path, fromJS(value));
      }
      this.setState({ query });
      if (
        !isMobile() &&
        this.props.requestProducts &&
        path !== ['reviewRating']
      ) {
        this.props.requestProducts(['query', ...path], value);
      }
    }
  };

  applyFilter = () => {
    const { query } = this.state;
    this.props.setQuery(query.toJS());
    if (this.props.requestProducts) {
      this.props.requestProducts(['page'], 1);
    }
  };

  clearFilter = () => {
    if (this.props.resetQuery) {
      this.props.resetQuery();
    }

    if (this.props.onChange) {
      this.props.onChange(fromJS({}));
    }
  };

  toggleFilter = () => {
    const { showFilter } = this.state;
    this.setState({ showFilter: !showFilter });
  };

  applyFilterButton: Object;

  renderCheckboxGroup(label: string, path: Array<string>, options: Object) {
    let type = [];
    const typeFromState = (this.state.value || this.state.query).getIn(path);

    if (typeFromState) {
      type = typeFromState.toJS();
    }

    return (
      <div className="column small-12">
        <div className="row align-middle">
          <div className="column small-12">
            <div className="productFilter__label">{label}</div>
          </div>
          <CheckboxGroup
            value={type}
            onChange={val => this.onCheckGroupChange(path, val)}
            className="small-12 column"
          >
            <div className="productFilter__input">
              {options.map(option => {
                const id = generate();
                return (
                  <label
                    className="productFilter__checkboxItem"
                    key={generate()}
                    htmlFor={`${id}${option.value}`}
                  >
                    <CheckboxItem
                      id={`${id}${option.value}`}
                      value={option.value}
                      className="mr-mn"
                    />
                    <Icon glyph={option.icon} size={20} className="mr-sm" />
                    <span className="fs-md t-capitalize">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </CheckboxGroup>
        </div>
      </div>
    );
  }

  render() {
    const { category, options, lpVersion } = this.props;
    const { query: Query, showFilter, value: Value } = this.state;

    const query = Value || Query;
    const data = options || Value;
    let queryRating = [];

    if (query) {
      const rating = query.getIn(['rating']);
      if (rating) {
        queryRating = rating.toJS();
      }
    }

    return (
      <div className="productFilter">
        <div className="row show-for-small-only">
          <div className="column small-12">
            <Sticky innerZ={9}>
              <Link
                className="productFilter__toggleFilter"
                onClick={this.toggleFilter}
              >
                <Icon
                  glyph={IconFilter}
                  size={20}
                  className="productFilter__filterIcon mr-sm"
                />
                {showFilter ? (
                  <span>Hide Filter</span>
                ) : (
                  <span>Show Filter</span>
                )}
                <Icon
                  glyph={showFilter ? IconChevronUp : IconChevronDown}
                  size={14}
                  className="productFilter__toggleIcon mr-sm"
                />
              </Link>
            </Sticky>
          </div>
        </div>
        {showFilter && (
          <div>
            <div className="row">
              {lpVersion && (
                <div className="column small-12">
                  <div className="row align-middle">
                    <div className="column small-12">
                      <div className="productFilter__label">Review Rating</div>
                    </div>
                    <div className="column small-12">
                      <div className="large productFilter__input">
                        <StarRating
                          className="productFilter__input"
                          readonly={false}
                          initialRating={Number(query.get('reviewRating', 0))}
                          onChange={v => {
                            this.onCheckGroupChange(['reviewRating'], v);
                          }}
                          size={19}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {(category === 'Strain' || category === 'Oil') && (
                <div className="column small-12">
                  <div className="row align-middle">
                    <div className="column small-12">
                      <div className="productFilter__label">Awards</div>
                    </div>
                    <div className="column small-12">
                      <Checkbox
                        className="productFilter__checkboxContainer"
                        name="available"
                        onChange={e => {
                          this.onCheckChange(e.target.checked, ['awards']);
                        }}
                        checked={!!query.getIn(['awards'])}
                      >
                        <Icon
                          glyph={IconAward}
                          size={30}
                          className="productFilter__awardsBadge mr-tn"
                        />
                        <div className="fs-md productFilter__imageCheckLabel">
                          <div>Canadian Cannabis</div>
                          <div>Awards Winner</div>
                        </div>
                      </Checkbox>
                    </div>
                  </div>
                </div>
              )}
              {category === 'Strain' &&
                this.renderCheckboxGroup(
                  'Type',
                  ['type'],
                  FILTER_OPTIONS.STRAIN_ICON_TYPE_OPTIONS
                )}
              {category === 'Oil' &&
                this.renderCheckboxGroup(
                  'Type',
                  ['type'],
                  FILTER_OPTIONS.OIL_ICON_TYPE_OPTIONS
                )}
              {(category === 'Strain' || category === 'Oil') &&
                this.renderCheckboxGroup(
                  'Time of consumption',
                  ['timeOfConsumption'],
                  FILTER_OPTIONS.STRAIN_ICON_TIME_OPTIONS
                )}

              {data &&
                data.entrySeq().map(([key, value]) => {
                  const hiddenFilters = [
                    'name',
                    'positiveEffects',
                    'negativeEffects',
                    'names',
                    'types',
                  ];
                  if (category === 'Product') {
                    hiddenFilters.push('tags', 'business');
                  }
                  if (lpVersion && key === 'business') {
                    hiddenFilters.push('business');
                  }
                  let label;
                  switch (key) {
                    case 'producer_name':
                      label = 'producer';
                      break;
                    case 'prescribedFor':
                      label = 'conditions';
                      break;
                    case 'symptoms':
                      label = 'symptoms helped';
                      break;
                    case 'business':
                      label = 'producers';
                      break;
                    default:
                      label = key;
                  }
                  let isMulti = true;
                  if (key === 'business') {
                    isMulti = false;
                  }
                  if (!includes(hiddenFilters, key) && value.size) {
                    let valueData = null;
                    const filterData = query.getIn([key]);
                    if (filterData) {
                      if (isMulti === true) {
                        valueData = filterData.toJS();
                      } else {
                        valueData = filterData;
                      }
                    }
                    return (
                      <div
                        className="column small-12 productFilter__topItem"
                        key={key}
                      >
                        <div className="row align-middle">
                          <div className="column small-12">
                            <div className="productFilter__label">{label}</div>
                          </div>
                          <div className="column small-12">
                            <CustomSelect
                              className="large productFilter__input"
                              onChange={this.onSelectChange}
                              meta={[key]}
                              value={valueData}
                              multi={isMulti}
                              options={transformOptions(value.toJS())}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}

              {!lpVersion && (
                <div className="column small-12">
                  <div className="row align-middle">
                    <div className="column small-12">
                      <div className="productFilter__label">Rating</div>
                    </div>
                    <CheckboxGroup
                      name="queryRating"
                      value={queryRating}
                      onChange={value =>
                        this.onCheckGroupChange(['rating'], value)
                      }
                      className="small-12 column"
                    >
                      <div className="productFilter__input">
                        {FILTER_OPTIONS.RATING_OPTIONS.map(option => (
                          <label
                            className="productFilter__checkboxItem mb-sm"
                            key={generate()}
                            htmlFor={option}
                          >
                            <CheckboxItem
                              id={option}
                              value={option}
                              className="mr-mn"
                            />
                            <StarRating
                              readonly
                              size={19}
                              initialRating={Number(option)}
                            />
                          </label>
                        ))}
                      </div>
                    </CheckboxGroup>
                  </div>
                </div>
              )}

              {category !== 'Product' && (
                <div className="column small-12">
                  <div className="row">
                    <div className="column small-12">
                      <div className="productFilter__label">
                        {category === 'Oil' ? 'THC (mg/ml)' : 'THC (%)'}
                      </div>
                    </div>

                    <div className="column small-12">
                      <RangeSlider
                        maxValue={100}
                        value={query
                          .get('thc', fromJS([0, 100]))
                          .toJS()
                          .map(v => Number(v))}
                        allowCross={false}
                        withRowClass={false}
                        onChange={range =>
                          this.onRangeInternalChange(['thc'], range)
                        }
                        onAfterChange={range =>
                          this.onCheckGroupChange(['thc'], range)
                        }
                        withTwoHandles
                      />
                    </div>

                    <div className="column small-12">
                      <div className="productFilter__label">
                        {category === 'Oil' ? 'CBD (mg/ml)' : 'CBD (%)'}
                      </div>
                    </div>

                    <div className="column small-12">
                      <RangeSlider
                        maxValue={100}
                        onChange={range =>
                          this.onRangeInternalChange(['cbd'], range)
                        }
                        value={query
                          .get('cbd', fromJS([0, 100]))
                          .toJS()
                          .map(v => Number(v))}
                        allowCross={false}
                        withRowClass={false}
                        onAfterChange={range =>
                          this.onCheckGroupChange(['cbd'], range)
                        }
                        withTwoHandles
                      />
                    </div>
                  </div>
                </div>
              )}
              {lpVersion && (
                <div className="column small-12">
                  <div className="row">
                    <div className="column small-12">
                      <div className="productFilter__label">
                        {getPriceFilterLabel(category)}
                      </div>
                    </div>

                    <div className="column small-12">
                      <RangeSlider
                        maxValue={200}
                        value={query
                          .get('price', fromJS([0, 200]))
                          .toJS()
                          .map(v => Number(v))}
                        allowCross={false}
                        withRowClass={false}
                        onChange={range =>
                          this.onRangeInternalChange(['price'], range)
                        }
                        onAfterChange={range =>
                          this.onCheckGroupChange(['price'], range)
                        }
                        withTwoHandles
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              <div className="column">
                <Link
                  className="productFilter__clearAll"
                  onClick={this.clearFilter}
                >
                  <Icon glyph={IconShowAll} size={14} className="mr-sm" />
                  Clear all filters
                </Link>
              </div>
            </div>
            <div className="row show-for-small-only">
              <div className="column small-12">
                <Link
                  ref={instance => {
                    if (instance) this.applyFilterButton = instance;
                  }}
                  className="productFilter__applyFilter"
                  onClick={this.applyFilter}
                >
                  <span>Apply Filters</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ProductFilter;
