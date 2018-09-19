// @flow

import React, { Component } from 'react';
import ProgressBar from 'components/ProgressBar';

type Props = {
  data: Map<string, Object>,
};

class EffectPanel extends Component<Props> {
  render() {
    const { data } = this.props;
    return (
      <div className="effectList">
        <div className="mb-sm text-center">As Reported by Users</div>
        {data &&
          data.entrySeq().map(([key, value]) => (
            <div className="mb-md" key={key}>
              <div className="row">
                <div className="column small-6 fs-md t-capitalize">
                  <strong>{value.get('name')}</strong>
                </div>
                <div className="column small-6 fs-md text-right">
                  <strong>{value.get('value')}</strong>
                </div>
              </div>
              <div className="row">
                <div className="column small-12 show-for-small-only">
                  <ProgressBar
                    width={4}
                    trailWidth={4}
                    value={value.get('value')}
                    maxValue={10}
                  />
                </div>
                <div className="column small-12 hide-for-small-only">
                  <ProgressBar value={value.get('value')} maxValue={10} />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default EffectPanel;
