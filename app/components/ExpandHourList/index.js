// @flow

import * as React from 'react';
import cx from 'classnames';
import moment from 'moment-timezone';
import Icon from 'components/Icon';

import ChevronDown from 'images/sprite/chevron-down.svg';
import ChevronUp from 'images/sprite/chevron-up.svg';
import './styles.scss';

const weekNames = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

type Props = {
  data: Object,
  date?: string,
};

type State = {
  show: boolean,
};

const getTimeString = data => {
  if (data.get('isActive') === true) {
    return `${data.get('timeFrom')} - ${data.get('timeTill')}`;
  }
  return '';
};

class ExpandHourList extends React.Component<Props, State> {
  state = {
    show: false,
  };

  handleToggle = (e: Object) => {
    this.setState({ show: !this.state.show });
    e.stopPropagation();
  };

  render() {
    const { data, date } = this.props;
    if (!data || data.size === 0) {
      return null;
    }
    const today = moment(date).tz('America/Toronto');
    const todayWeekIndex = (today.day() - 1) % 7;
    const todayData = data.get(todayWeekIndex);

    const todayString = today.format('YYYY-MM-DD');
    const startDate = moment.tz(
      `${todayString} ${todayData.get('timeFrom')}`,
      'YYYY-MM-DD HH:mm A',
      'America/Toronto'
    );
    const endDate = moment.tz(
      `${todayString} ${todayData.get('timeTill')}`,
      'YYYY-MM-DD HH:mm A',
      'America/Toronto'
    );

    const businessOpened = today.isBetween(startDate, endDate);

    let status = 'Closed Now';
    let statusClass = 'expandHourList__status--danger';
    if (todayData && todayData.get('isActive') === true && businessOpened) {
      status = 'Open Now';
      statusClass = 'expandHourList__status--success';
    }

    return (
      <div className="expandHourList">
        <div
          className="expandHourList__labelWrapper"
          onClick={this.handleToggle}
          role="button"
        >
          <div className="expandHourList__label">Hours:</div>
          <div className={cx('expandHourList__status', statusClass)}>
            {status}
          </div>
          <div className="expandHourList__icon">
            <Icon glyph={this.state.show ? ChevronUp : ChevronDown} size={12} />
          </div>
        </div>
        {this.state.show && (
          <div className="expandHourList__dropdown">
            {data &&
              data.entrySeq().map(([key, value]) => {
                if (value.get('isActive') === false) {
                  return null;
                }
                return (
                  <div className="expandHourList__dropdownWrapper" key={key}>
                    <div className="expandHourList__label">&nbsp;</div>
                    <div
                      className={cx('expandHourList__status', {
                        'expandHourList__status--active':
                          key === todayWeekIndex,
                      })}
                    >
                      {weekNames[key]}
                    </div>
                    <div className="expandHourList__time">
                      {getTimeString(value)}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }
}

export default ExpandHourList;
