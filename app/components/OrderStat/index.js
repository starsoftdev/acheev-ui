// @flow

import React, { Component } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';

import Link from 'components/Link';

import './styles.scss';

const data = [
  { date: 'Aug 28', count: 2, amt: 2400, uvError: [75, 20] },
  { date: 'Aug 29', count: 4, amt: 2400, uvError: [90, 40] },
  { date: 'Aug 30', count: 4, amt: 2400, uvError: 40 },
  { date: 'Aug 31', count: 6, amt: 2400, uvError: 20 },
  { date: 'Sep 1', count: 0, amt: 2400, uvError: 28 },
  { date: 'Sep 2', count: 4, amt: 2400, uvError: [90, 20] },
  { date: 'Sep 3', count: 2, amt: 2400, uvError: [28, 40] },
];

class OrderStat extends Component {
  render() {
    return (
      <div className="orderStat">
        <div className="row align-middle mb-lg">
          <div className="column">
            <h1 className="fs-xl c-darkest-gray nm">Order Statistic</h1>
          </div>
          <div className="column shrink">
            <Link className="orderStat__btnViewAll">View All</Link>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <div className="orderStat__graph">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={730}
                  height={250}
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <ReferenceLine x="Aug 29" />
                  <ReferenceLine x="Aug 30" />
                  <ReferenceLine x="Aug 31" />
                  <ReferenceLine x="Sep 1" />
                  <ReferenceLine x="Sep 2" />
                  <ReferenceLine x="Sep 3" />
                  <Line type="linear" dataKey="count" stroke="#2da3f2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderStat;
