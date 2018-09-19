// @flow

import React from 'react';
import { BarChart, XAxis, YAxis, Bar, Label } from 'recharts';
import cx from 'classnames';

import './styles.scss';

type Props = {
  value: number,
  maxValue?: number,
  className?: string,
};

const StepProgressChart = ({ value, maxValue = 300, className }: Props) => {
  const data = [
    { name: 'score', completed: value, remaining: maxValue - value },
  ];

  return (
    <div className={cx('row align-middle', className)}>
      <div className="shrink column">
        <div className="stepProgressLineChart">
          <BarChart
            layout="vertical"
            width={250}
            height={75}
            data={data}
            margin={{
              top: 30,
              right: 0,
              left: 10,
              bottom: 0,
            }}
          >
            <XAxis
              type="number"
              tickCount={2}
              axisLine={false}
              tickLine={false}
            />
            <YAxis dataKey="score" type="category" mirror axisLine={false}>
              <Label
                className="stepProgressLineChart__scoreLabel"
                value={value}
                offset={0}
                position="insideTopLeft"
              />
            </YAxis>
            <Bar
              dataKey="completed"
              barSize={10}
              stackId="a"
              fill="#19AA9C"
              isAnimationActive={false}
              animationEasing="linear"
            />
            <Bar
              dataKey="remaining"
              barSize={10}
              stackId="a"
              fill="#E3E8F0"
              isAnimationActive={false}
              animationEasing="linear"
            />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default StepProgressChart;
