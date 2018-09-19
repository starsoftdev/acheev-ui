// @flow

import React, { Component } from 'react';
import type { Map } from 'immutable';

import { Tabs, Tab } from 'components/Tabs';
import Table from 'components/Table';
import CustomProgressBar from 'components/ProgressBar';

type Props = {
  data: Map<*, *>,
  progressBar?: any,
  message?: string,
};
type State = {
  activeKey: number,
};

const items = {
  symptomsHelped: {
    tabLabel: 'Symptoms Helped',
    thLabel: 'Symptom',
  },
  positiveEffects: {
    tabLabel: 'Positive Effects',
    thLabel: 'Effect',
  },
  negativeEffects: {
    tabLabel: 'Negative Effects',
    thLabel: 'Effect',
  },
};

class LPEffectPane extends Component<Props, State> {
  state = {
    activeKey: 0,
  };

  handleSelect = (activeKey: number) => {
    this.setState({ activeKey });
  };

  render() {
    const {
      data,
      progressBar: ProgressBar = CustomProgressBar,
      message = 'No data for selected period',
    } = this.props;
    if (!data || !data.size) return null;
    const { activeKey } = this.state;
    const keys = Object.keys(items);
    const noData = keys.every(i => !data.get(i).size);
    if (noData) return <div>{message}</div>;
    return (
      <Tabs activeKey={activeKey} onSelect={this.handleSelect}>
        {data.entrySeq().map(([i, item], index) => {
          if (item.size) {
            return (
              <Tab key={i} eventKey={index} title={items[i].tabLabel}>
                <Table>
                  <thead>
                    <tr>
                      <th>{items[i].thLabel}</th>
                      <th>Score</th>
                      <th>Top Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.entrySeq().map(([subI, subItem]) => (
                      <tr key={subI}>
                        <td>{subItem.get('name')}</td>
                        <td>
                          <ProgressBar
                            value={subItem.get('score')}
                            maxValue={10}
                            showValue
                            valuePostfix="/10"
                            width={11}
                          />
                        </td>
                        <td>{subItem.getIn(['product', 'name'])}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
            );
          }
          return null;
        })}
      </Tabs>
    );
  }
}

export default LPEffectPane;
