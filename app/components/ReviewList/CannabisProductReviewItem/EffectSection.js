// @flow
import React, { Component } from 'react';
import Link from 'components/Link';
import { map } from 'lodash-es';
import TagList from 'components/TagList';

import './styles.scss';

type Props = {
  title: string,
  data: Array<Object>,
  lpVersion?: boolean,
};

type State = {
  showDetail: boolean,
};

class EffectSection extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showDetail: false,
    };
  }
  render() {
    const { data, title, lpVersion } = this.props;
    if (!data || data.length === 0) {
      return null;
    }
    const names = map(data, item => item.name);
    return (
      <div className="row mb-md">
        <div className="column">
          <div className="mb-sm fs-mx">
            <div className="row align-middle">
              <div className="column shrink">
                <strong>{title}</strong>
              </div>
              {!lpVersion && (
                <div className="column">
                  <Link
                    onClick={() =>
                      this.setState({ showDetail: !this.state.showDetail })
                    }
                  >
                    {this.state.showDetail ? 'Hide' : 'Show'} Breakdown
                  </Link>
                </div>
              )}
            </div>
          </div>
          {this.state.showDetail || lpVersion ? (
            <TagList value={data} readOnly showEffects />
          ) : (
            <TagList value={names} readOnly />
          )}
        </div>
      </div>
    );
  }
}

export default EffectSection;
