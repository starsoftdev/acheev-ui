// @flow

import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { generate } from 'shortid';
import { maxBy, minBy, get } from 'lodash-es';
import cx from 'classnames';

import './styles.scss';

type Props = {
  data: ?Array<Object>,
  message?: string,
  innerComponent?: any,
  label?: string,
  labelPrefix?: Function,
  valuePostfix?: string,
  palette?: 'blue' | 'green',
  className?: string,
  radius?: number,
  thickness?: number,
  stroke?: string,
  stackForSmall?: boolean,
};

const COLORS: Object = {
  blue: ['#003fa3', '#017fcc', '#11b4e4', '#84d6ef', '#c9eaf6'],
  green: ['#276c07', '#64a62a', '#a0ce67', '#cbe3b1', '#e6f0dd'],
};

const CustomPieChart = ({
  data,
  message = 'No data for selected period',
  innerComponent,
  label,
  labelPrefix,
  valuePostfix,
  palette = 'blue',
  className,
  radius = 112.5,
  thickness = 25,
  stroke = 'white',
  stackForSmall,
}: Props) => {
  if (!data || !data.length) return <h6>{message}</h6>;
  const maxCount = get(maxBy(data, o => o.count), 'count', 0);
  const minCount = get(minBy(data, o => o.count), 'count', 0);
  const minSize = 15;
  const maxSize = 30;
  return (
    <div className={cx('row align-middle align-center', className)}>
      <div className="shrink column">
        <div className="pieChart">
          <PieChart
            className="pieChart__svg"
            width={radius * 2}
            height={radius * 2}
          >
            <Pie
              data={data}
              dataKey="count"
              innerRadius={radius - thickness - 2}
              outerRadius={radius}
            >
              {data.map((entry, index) => (
                <Cell
                  fill={COLORS[palette][index % COLORS[palette].length]}
                  strokeWidth="5"
                  stroke={stroke}
                  key={generate()}
                />
              ))}
            </Pie>
          </PieChart>
          {innerComponent && (
            <div className="pieChart__inner">{innerComponent}</div>
          )}
        </div>
      </div>
      <div
        className={cx('pieChart__legend column', {
          'small-12 medium-expand': stackForSmall,
        })}
      >
        {data.map((entry, index) => {
          const value = entry.count;
          let size;
          if (value === maxCount) {
            size = maxSize;
          } else if (value === minCount) {
            size = minSize;
          } else {
            size = (minSize + maxSize) / 2;
          }
          return (
            <div
              className="pieChart__pancakeRow row align-middle"
              key={generate()}
            >
              <div className="shrink column">
                <div style={{ width: maxSize }}>
                  <div
                    className="pieChart__pancake"
                    style={{
                      backgroundColor:
                        COLORS[palette][index % COLORS[palette].length],
                      width: size,
                      height: size,
                    }}
                  />
                </div>
              </div>
              <div className="column">
                <div className="pieChart__value">
                  {entry.count || 0}
                  {valuePostfix}
                </div>
                <div className="pieChart__label">
                  {labelPrefix && labelPrefix(entry)} {label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomPieChart;
