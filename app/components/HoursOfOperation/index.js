// @flow

import * as React from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import { cloneDeep } from 'lodash-es';

import Select from 'components/CustomSelect';

import './styles.scss';

type Props = {
  data: Array<Object>,
  onChange: Function,
};

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timeFrames: Array<string> = [
  '12:00 AM',
  '12:30 AM',
  '01:00 AM',
  '01:30 AM',
  '02:00 AM',
  '02:30 AM',
  '03:00 AM',
  '03:30 AM',
  '04:00 AM',
  '04:30 AM',
  '05:00 AM',
  '05:30 AM',
  '06:00 AM',
  '06:30 AM',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
];

class HoursOfOperation extends React.Component<Props> {
  onChangeActive = (hours: Array<Object>, index: number, isActive: boolean) => {
    const modifiedHours = hours;
    modifiedHours[index].isActive = !isActive;
    this.props.onChange(modifiedHours);
  };

  onChangeTime = (
    hours: Array<Object>,
    index: number,
    key: string,
    value: string
  ) => {
    const modifiedHours = hours;
    modifiedHours[index][key] = value;
    this.props.onChange(modifiedHours);
  };

  render() {
    const { data } = this.props;
    if (!data) return null;
    const hours = cloneDeep(data);
    return (
      <div className="hoursOfOperation row">
        {data.map((item, i) => (
          <div className="shrink column npr mb-xl" key={generate()}>
            <div
              className={cx(
                'hoursOfOperation__day',
                item.isActive
                  ? 'hoursOfOperation__day--active'
                  : 'hoursOfOperation__day--nonActive'
              )}
              onClick={() => this.onChangeActive(hours, i, item.isActive)}
              role="button"
            />
            <div className="mb-md">{dayNames[i]}</div>
            {item.isActive && (
              <div>
                <div className="fs-tn t-uppercase">From:</div>
                <Select
                  className="mb-sm"
                  options={timeFrames}
                  clearable={false}
                  value={item.timeFrom}
                  sortAlphabetically={false}
                  onChange={e =>
                    this.onChangeTime(hours, i, 'timeFrom', e.value)
                  }
                />
                <div className="fs-tn t-uppercase">Till:</div>
                <Select
                  options={timeFrames}
                  clearable={false}
                  value={item.timeTill}
                  sortAlphabetically={false}
                  onChange={e =>
                    this.onChangeTime(hours, i, 'timeTill', e.value)
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default HoursOfOperation;
