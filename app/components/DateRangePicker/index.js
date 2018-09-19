// @flow

import React, { Component } from 'react';
import moment from 'moment';

import Icon from 'components/Icon';
import Datepicker from 'components/ReactDatepicker';

import Calendar from 'images/sprite/calendar.svg';

import CustomInput from './custom-input';

import './styles.scss';

type Props = {
  from: moment,
  to: moment,
  onChangeFrom: Function,
  onChangeTo: Function,
};

const commonProps = {
  showYearDropdown: true,
  dateFormatCalendar: 'MMMM',
};

export default class DateRangePicker extends Component<Props> {
  render() {
    const { from, to, onChangeFrom, onChangeTo } = this.props;
    return (
      <div className="dateRangePicker row align-middle">
        <div className="shrink column npr">
          <Icon glyph={Calendar} />
        </div>
        <div className="shrink column">
          <Datepicker
            selected={from}
            minDate={moment('2014-01-01')}
            maxDate={to}
            onChange={onChangeFrom}
            customInput={<CustomInput before="From" />}
            {...commonProps}
          />
        </div>
        <div className="shrink column">
          <Datepicker
            selected={to}
            minDate={from}
            maxDate={moment()}
            onChange={onChangeTo}
            customInput={<CustomInput before="To" />}
            calendarClassName="arrow-right"
            popperPlacement="bottom-end"
            {...commonProps}
          />
        </div>
      </div>
    );
  }
}
