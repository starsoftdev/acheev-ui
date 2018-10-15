// @flow

import React, { Component } from 'react';

import Icon from 'components/Icon';

import RightArrowIcon from 'images/sprite/right-arrow.svg';

import './styles.scss';

type Props = {
  className?: string,
};

class JobStatusCard extends Component<Props> {
  render() {
    const { className = '' } = this.props;
    const cx = className ? `jobStatusCard ${className}` : 'jobStatusCard';
    return (
      <div className={cx}>
        <div className="row align-middle">
          <div className="column">
            <div className="jobStatusCard__title">Order Here 114</div>
          </div>
          <div className="column shrink">
            <div className="jobStatusCard__status">Pending</div>
          </div>
          <div className="column shrink">
            <div className="jobStatusCard__price">$350</div>
          </div>
          <div className="column shrink">
            <Icon
              className="jobStatusCard__icon"
              glyph={RightArrowIcon}
              width={20}
              height={15}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default JobStatusCard;
