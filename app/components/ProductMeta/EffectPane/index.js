// @flow

import React, { Component } from 'react';
import { Tabs, Tab } from 'components/Tabs';
import EffectPanel from '../EffectPanel';

import './styles.scss';

type Props = {
  data: Object,
};
type State = {
  activeKey: string,
};

class EffectPane extends Component<Props, State> {
  state = {
    activeKey: '1',
  };

  handleSelect = (activeKey: string) => {
    this.setState({ activeKey });
  };

  render() {
    const { data } = this.props;
    const { activeKey } = this.state;
    const symptomsHelped = data.get('symptomsHelped');
    const positiveEffects = data.get('positiveEffects');
    const negativeEffects = data.get('negativeEffects');
    return (
      <div className="effectPane">
        <Tabs activeKey={activeKey} onSelect={this.handleSelect}>
          <Tab eventKey="1" title="Symptoms Helped">
            {symptomsHelped && symptomsHelped.size > 0 ? (
              <EffectPanel data={symptomsHelped} />
            ) : (
              'No data available'
            )}
          </Tab>
          <Tab eventKey="2" title="Positive Effects">
            {positiveEffects && positiveEffects.size > 0 ? (
              <EffectPanel data={positiveEffects} />
            ) : (
              'No data available'
            )}
          </Tab>
          <Tab eventKey="3" title="Negative Effects">
            {negativeEffects && negativeEffects.size > 0 ? (
              <EffectPanel data={negativeEffects} />
            ) : (
              'No data available'
            )}
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default EffectPane;
