// @flow

import React, { Component } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Label,
} from 'recharts';
import numeral from 'numeral';
import moment from 'moment';
import { isEmpty } from 'lodash-es';

import './styles.scss';

type Props = {
  data: Array<Object>,
  message?: string,
};

const textAttrs = {
  fontSize: '14px',
  fontWeight: 'bold',
  fill: '#a1a7bd',
};

const dotStyle = { strokeWidth: 3, r: 5.5 };

const YTick = ({ x, y, payload }: Object) => (
  <text x={x} y={y} textAnchor="end" {...textAttrs}>
    {numeral(payload.value).format('0.[00]%')}
  </text>
);

const XTick = ({ x, y, payload }: Object) => (
  <text x={x} y={y} dy={16} textAnchor="middle" {...textAttrs}>
    {moment(payload.value).format('ll')}
  </text>
);

class CustomLineChart extends Component<Props> {
  static defaultProps = {
    message: "You don't have any reviews for selected period",
  };
  render() {
    const { data, message } = this.props;
    if (!data) return null;
    if (isEmpty(data)) return <h6>{message}</h6>;
    const productRatios = data.map(o => o.productRatio);
    const max = productRatios.reduce((a, b) => Math.max(a, b));
    return (
      <div className="lineChart">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 15, right: 10, bottom: 35 }}>
            <XAxis dataKey="date" tick={<XTick />} minTickGap={10}>
              <Label
                value="Date Range"
                position="insideBottom"
                offset={-25}
                className="lineChart__label"
              />
            </XAxis>
            <YAxis
              tickCount={6}
              tick={<YTick />}
              domain={[0, Math.ceil(max * 10) / 10]}
            />
            <CartesianGrid horizontal={false} />
            <Legend wrapperStyle={{ bottom: 0 }} />
            <Line
              dataKey="businessRatio"
              name="Business Reviews"
              stroke="#0a78b3"
              strokeWidth={3}
              dot={dotStyle}
            />
            <Line
              dataKey="productRatio"
              name="Product Reviews"
              stroke="#11b4e4"
              strokeWidth={3}
              dot={dotStyle}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default CustomLineChart;
