// @flow

import React, { Component } from 'react';

import Link from 'components/Link';
import Icon from 'components/Icon';
import './styles.scss';

type Props = {
  to: string,
  title: string,
  point: number,
  icon: any,
  children: any,
  buttonTitle: string,
};

class EarnRewardsLinkPanel extends Component<Props> {
  render() {
    const { to, title, point, icon, children, buttonTitle } = this.props;
    return (
      <div className="earnRewardsLinkPanel">
        <div className="row">
          <div className="column small-12 medium-3 text-center">
            <Icon
              className="earnRewardsLinkPanel__icon"
              glyph={icon}
              size={150}
            />
          </div>
          <div className="column small-12 medium-9">
            <div className="row">
              <div className="earnRewardsLinkPanel__title column small-12 medium-expand mb-sm">
                {title}
              </div>
              <div className="earnRewardsLinkPanel__points column small-12 medium-shrink mb-sm">
                {point} pts
              </div>
              <div className="column small-12 mb-md">{children}</div>
              <div className="column small-12 mb-md">
                <Link to={to} className="button small secondary">
                  {buttonTitle}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EarnRewardsLinkPanel;
