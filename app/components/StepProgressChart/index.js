// @flow

import React from 'react';
import { PieChart, Pie, Cell, Label } from 'recharts';
import { generate } from 'shortid';
import cx from 'classnames';

import './styles.scss';

type Props = {
  value: number,
  maxValue?: number,
  className?: string,
};

const StepProgressChart = ({ value, maxValue = 300, className }: Props) => {
  const data = [
    { value, name: 'completed', color: '#19AA9C' },
    { value: maxValue - value, name: 'remaining', color: '#E3E8F0' },
  ];
  const radius = 102.5;
  const thickness = 15;

  return (
    <div className={cx('row align-middle', className)}>
      <div className="stepProgressChart">
        <PieChart
          className="stepProgressChart__svg"
          width={radius * 2}
          height={radius + 20}
        >
          <Pie
            cy={radius}
            data={data}
            dataKey="value"
            nameKey="name"
            startAngle={180}
            endAngle={0}
            isAnimationActive={false}
            innerRadius={radius - thickness}
            outerRadius={radius - 2}
          >
            {data.map(item => <Cell fill={item.color} key={generate()} />)}
            <Label
              className="stepProgressChart__ptLabel"
              value={value}
              offset={0}
              position="center"
            />
            <Label
              className="stepProgressChart__minLabel"
              value={0}
              position="center"
            />
            <Label
              className="stepProgressChart__maxLabel"
              value={maxValue}
              position="center"
            />
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default StepProgressChart;
