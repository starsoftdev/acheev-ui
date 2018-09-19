// @flow

import React, { Component } from 'react';
import moment from 'moment';
import cx from 'classnames';

import CustomSelect from 'components/CustomSelect';
import FILTER_OPTIONS from 'enum/filter/options';

type Props = {
  value?: Date,
  onChange: Function,
  onChangeYear?: (year: number) => void,
  initialYear: number,
  yearCounts: number,
  maxYear?: number,
  expanded?: boolean,
  onlyYear: boolean,
  clearable?: boolean,
};
type State = {
  year: string,
  month: string,
  day: string,
};
class DatePicker extends Component<Props, State> {
  static defaultProps = {
    initialYear: '',
    onlyYear: false,
    expanded: false,
    clearable: false,
  };

  constructor(props: Props) {
    super(props);
    const month = props.value ? props.value.getMonth() + 1 : '';
    this.state = {
      year: props.value
        ? props.value.getFullYear().toString()
        : `${props.initialYear}`,
      month: month.toString(),
      day: props.value ? props.value.getDate().toString() : '',
    };
  }

  onChange = (e: Object, field: string) => {
    const { year, month, day } = this.state;
    let newYear = year;
    let newMonth = month;
    let newDay = day;
    let m = null;
    const value = e ? e.value : '';
    switch (field) {
      case 'year':
        newYear = value;
        break;
      case 'month':
        newMonth = value;
        break;
      case 'day':
        newDay = value;
        break;
      default:
        break;
    }
    this.setState({ year: newYear, month: newMonth, day: newDay });

    if (field === 'year' && value !== '' && this.props.onChangeYear) {
      this.props.onChangeYear(e.value);
    }
    if (newMonth !== '' && newDay !== '' && newYear !== '') {
      m = moment(`${newMonth}-${newDay}-${newYear}`, 'MM-DD-YYYY').toDate();
    }
    if (this.props.onChange) {
      this.props.onChange(m);
    }
  };

  getDateValues = () => {
    const dates = [];
    for (let i = 1; i <= 31; i += 1) {
      dates.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return dates;
  };

  getYearValues = (maxYear: number) => {
    const years = [];
    const endYear = maxYear || moment().year();
    const startYear = endYear - this.props.yearCounts;

    for (let i = endYear; i > startYear; i -= 1) {
      years.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return years;
  };

  render() {
    const { year, month, day } = this.state;
    const { expanded, onlyYear, maxYear, clearable } = this.props;

    return (
      <div className="datePicker">
        <div className="row">
          {!onlyYear && (
            <div
              className={cx('column small-12', {
                'medium-4': !expanded,
                'mb-md': expanded,
              })}
            >
              <CustomSelect
                className="large datepicker"
                value={month}
                clearable={clearable}
                options={FILTER_OPTIONS.MONTH_OPTIONS}
                placeholder="Month"
                onChange={e => this.onChange(e, 'month')}
                sortAlphabetically={false}
              />
              <div className="show-for-small-only mb-sm" />
            </div>
          )}

          {!onlyYear && (
            <div
              className={cx('column small-12', {
                'medium-4': !expanded,
                'mb-md': expanded,
              })}
            >
              <CustomSelect
                className="large datepicker"
                value={day}
                clearable={clearable}
                options={this.getDateValues()}
                placeholder="Day"
                onChange={e => this.onChange(e, 'day')}
                sortAlphabetically={false}
              />
              <div className="show-for-small-only mb-sm" />
            </div>
          )}

          <div
            className={cx('column small-12', {
              'medium-4': !onlyYear && !expanded,
              'mb-md': expanded,
            })}
          >
            <CustomSelect
              className="large datepicker"
              value={year}
              clearable={clearable}
              options={this.getYearValues(maxYear)}
              placeholder="Year"
              onChange={e => this.onChange(e, 'year')}
            />
            <div className="show-for-small-only mb-sm" />
          </div>
        </div>
      </div>
    );
  }
}

export default DatePicker;
